import { Application as ExpressFeathers } from '@feathersjs/express'
import {
  HookContext as FeathersHookContext,
  HookOptions as FeathersHookOptions,
  NextFunction
} from '@feathersjs/feathers'

import type { BuildOptions, Model, Sequelize } from 'sequelize'
import type { Logger } from 'winston'

import { User } from './models/users.model'


export { NextFunction }

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {}

export interface Configuration {
  host: string
  port: number
  public: string
  paginate: {
    default: number
    max: number
  }
  postgres: {
    database: string
    username: string
    password: string
    host: string
  }
  static: {
    fileBeatRoot: string
  }
  audit: {
    dirname: string
  }
  auditLogger: Logger
  abstractLogger: Logger
  sequelizeClient: Sequelize
  sequelizeSync: PromiseLike<Sequelize>
}

// The application instance type that will be used everywhere else
export type Application = ExpressFeathers<ServiceTypes, Configuration>

// The context for hook functions - can be typed with a service class
export type HookContext<S = any> = FeathersHookContext<Application, S>

// The type for hook options - can be typed with a service class
export type HookOptions<S = any> = FeathersHookOptions<Application, S>

// A genetic type that allows adding an associate function when defining models.
// Borrowed from https://stackoverflow.com/a/66033308
export type DBModelStatic<T> = typeof Model
  & { associate?: (models: Model[]) => void }
  & { new(values?: Record<string, unknown>, options?: BuildOptions): T }


// Add the user as an optional property to all params
declare module '@feathersjs/feathers' {
  interface Params {
    user?: User
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BASE_URL: string
      DEBUG: string
      LOG_FORMAT: string
      POSTGRES_DB: string
      POSTGRES_HOST: string
      POSTGRES_USER: string
      ENVIRONMENT: 'development' | 'production' | 'test'
      NODE_ENV: 'development' | 'production'
      AUDIT_LOGS_DIR: string
      GIT_TAG_NUMBER: string

      // secrets
      POSTGRES_PASSWORD: string
    }
  }
}
