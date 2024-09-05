// USAGE:
// node scripts/index.ts scriptName anotherScript
// where ./scripts/scriptName.js and ./scripts/anotherScript.js exist
// and anotherScript will be ran after scriptName finishes
// Scripts should return a Promise if they want to be async

import { Promise } from 'bluebird'
import path from 'path'

// Import the API subapp
import app from '../src/app'
import { Application } from '../src/declarations'


interface Script {
  default: (app: Application) => void
}

// Map arguments to requires in current folder
const scripts = process.argv.slice(2).map((file: string) =>
  require(path.resolve(__dirname, file + '.ts')));

(Promise as any).mapSeries(scripts, (script: Script) => script.default(app))
  .catch((err: any) => console.error('Error in scripts: ', err))
  .then(() => console.log('Scripts ran'))
  .then(() => app.get('sequelizeClient').close())
  .then(() => process.exit())

export {}
