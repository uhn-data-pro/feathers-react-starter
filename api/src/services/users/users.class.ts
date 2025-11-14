import { SequelizeService } from 'feathers-sequelize'

import type { SequelizeAdapterOptions } from 'feathers-sequelize/src/declarations'

import { Application } from '../../declarations'

export class Users extends SequelizeService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: SequelizeAdapterOptions, app: Application) {
    super(options)
  }
}