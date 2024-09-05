import { Application } from '../../src/declarations'

export default function (app: Application) {
  const db = app.get('sequelizeClient')

  console.log('Resetting all models...')

  const models = <any> db.models
  Object.keys(models).forEach(name => {
    if ('associate' in models[name]) {
      models[name].associate(models)
    }
  })

  return db.sync({ force: true })
    .then(() => console.log('Successfully forcefully synced database'))
    .catch((err: any) => console.error(err))
}
