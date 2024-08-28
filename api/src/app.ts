import configuration from '@feathersjs/configuration'
import express, { errorHandler, json, notFound, rest, serveStatic, urlencoded } from '@feathersjs/express'
import { feathers } from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio'
import compress from 'compression'
import cors from 'cors'
import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import helmet from 'helmet'
import maxBy from 'lodash/maxBy'
import moment from 'moment'
import path from 'path'
import favicon from 'serve-favicon'
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

import appHooks from './app.hooks'
import authentication from './authentication'
import channels from './channels'

import { Application } from './declarations'
import logger from './logger'
import middleware from './middleware'
import sequelize from './sequelize'
import services from './services'

const { printf } = winston.format


const app: Application = express(feathers())

// Load app configuration
app.configure(configuration())

const GIT_TAG_NUMBER = process.env.GIT_TAG_NUMBER ?? 'develop'
const APP_BASE_URL = process.env.APP_BASE_URL ?? 'http://127.0.0.1:4002'

const corsOptions = {
  origin: APP_BASE_URL,
  credentials: true
}

//get filename for the audit log file to be created upon deploy
const getLogFileName = (): string => {

  const auditDir = app.get('audit').dirname
  const logFiles = fs.readdirSync(auditDir)
  const mostRecentFile = maxBy(logFiles, (file: string) => {
    const fullPath = path.join(auditDir, file)
    return fs.statSync(fullPath).mtimeMs
  })

  //if most recent file is not from today, or not for this tag number, give default name to new logfile
  if(mostRecentFile === undefined || mostRecentFile.indexOf(moment().format('YYYY-MM-DD')) == -1 || mostRecentFile.indexOf(GIT_TAG_NUMBER) == -1) {
    return `%DATE%_api_${GIT_TAG_NUMBER}_audit_logs.R0`
  }
  //otherwise just increment the number after 'R'
  let logFileNumber = parseInt(mostRecentFile.match(/(?<=\R)([0-9])+/)?.[0] ?? '0', 10)
  logFileNumber++
  return `%DATE%_api_${ GIT_TAG_NUMBER }_audit_logs.R` + logFileNumber
}

//setup audit logger
if(process.env.ENVIRONMENT === 'production') {
  const format_options = printf((log: any) => {
    const { message, time } = log

    return `${time} [${message}]: ${JSON.stringify(log)}`
  })

  // Instantiate audit logger
  app.configure(function(app: Application) {
    const rotateFileTransport: DailyRotateFile = new DailyRotateFile({
      // Daily log files
      datePattern: 'YYYY-MM-DD',
      filename: getLogFileName(),
      dirname: app.get('audit').dirname,
      zippedArchive: true,
      maxSize: 5000000,
      // Do not delete any old files
      maxFiles: undefined,
      options: { flags: 'a' }
    })

    app.set('auditLogger', winston.createLogger({
      format: format_options,
      transports: [
        rotateFileTransport
      ]
    }))
  })
}

// setup ABSTRACT logger
app.configure(() => {
  const filename = process.env.ENVIRONMENT === 'production' ? 'abstract_logs.log' : 'abstract_dev.log'
  const options = {
    filename: app.get('static').fileBeatRoot + '/' + filename
  }

  app.set('abstractLogger', winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new (winston.transports.File)(options)
    ]
  }))
})

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet())
app.use(helmet.hsts({ maxAge: 31536000, preload: true }))
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }))
app.use(cors({ origin: [ APP_BASE_URL ] }))
app.use(compress())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(favicon(path.join(app.get('public'), 'favicon.ico')))

// Host the public folder
app.use('/', serveStatic(app.get('public')))

// Set up Plugins and providers
app.configure(rest())
app.configure(socketio({
  cors: {
    origin: APP_BASE_URL,
    methods: [ 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS' ],
    allowedHeaders: [ 'Authorization', 'Content-Type' ]
  }
}))

app.configure(sequelize)

// Configure other middleware (see `middleware/index.ts`)
app.configure(middleware)
app.configure(authentication)

// Set up our services (see `services/index.ts`)
app.configure(services)
// Set up event channels (see channels.js)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(notFound())
app.use(errorHandler({
  html: false,
  logger,
  json: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    500: (err: any, req: Request, res: Response, next: NextFunction) => {      // All 500 errors are sent back to the client as 400 errors
      err.code = 400
      res.status(400)
      res.set('Content-Type', 'application/json')
      res.json(Object.assign({}, err.toJSON()))
    }
  }
}))

app.hooks(appHooks)

export default app
