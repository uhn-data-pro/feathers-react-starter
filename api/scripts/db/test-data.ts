import { Promise } from 'bluebird'
import { Model } from 'sequelize'

import { Application } from '../../src/declarations'
import { User } from '../../src/models/users.model'

const users: Partial<User>[] = [
  {
    email: 'admin@test.com',
    password: 'password',
  },
]

export default function(app: Application) {
  const db = app.get ('sequelizeClient')
  const models = db.models

  const modelCreate = (model: any, data: any, options: any) => {
    const Model = models[model]

    if (Array.isArray(data)) {
      return Model.bulkCreate(data, options)
    }

    return Model.create(data, options)
  }

  const serviceCreate = (service: any, data: any, params: any) => {
    if (Array.isArray(data)) {
      return (Promise as any).each(data, (item: Partial<Model>) => app.service(service).create(item, params))
    }

    return app.service(service).create(data, params)
  }

  console.log('Populating database with test data...')

  return serviceCreate('users', users, {})
    .then(() => console.log('Successfully populated database with test data'))
    .catch((err: any) => console.error(err))
}
