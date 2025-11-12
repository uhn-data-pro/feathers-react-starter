
import Bluebird from 'bluebird'
import { Model } from 'sequelize'

import { Application } from '../../src/declarations'
import { UserModel } from '../../src/models/declarations'

// This is meant to protect prod, so we default to 'production' if not set to be safe
const ENVIRONMENT = process.env.ENVIRONMENT || 'production'

const users: Partial<UserModel>[] = [
  {
    email: 'admin@test.com',
    password: 'password',
  },
]

export default function(app: Application) {
  if (ENVIRONMENT === 'production') {
    console.log('Test data seeding is disabled in production environment')
    return
  }

  const db = app.get('sequelizeClient')
  const models = db.models

  const modelCreate = (model: any, data: any, options?: any) => {
    const Model = models[model]

    if (Array.isArray(data)) {
      return Model.bulkCreate(data, options)
    }

    return Model.create(data, options)
  }

  const serviceCreate = (service: any, data: any, params?: any) => {
    if (Array.isArray(data)) {
      return Bluebird.each(data, (item: Partial<Model>) => app.service(service).create(item, params))
    }

    return app.service(service).create(data, params)
  }

  console.log('Populating database with test data...')

  return serviceCreate('users', users, {})
    .then(() => console.log('Successfully populated database with test data'))
    .catch((err: any) => console.error(err))
}
