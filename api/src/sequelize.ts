import { Sequelize } from 'sequelize'

import { Application } from './declarations'

export default function(app: Application) {
  const { database, username, password, host } = app.get('postgres')

  const sequelize = new Sequelize(database, username, password, {
    host,
    dialect: 'postgres',
    logging: false,
    define: {
      freezeTableName: true,
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  })
  const oldSetup = app.setup

  app.set('sequelizeClient', sequelize)

  app.setup = function(...args) {
    const result = oldSetup.apply(this, args)

    // Set up data relationships
    const models = <any> sequelize.models
    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        models[name].associate(models)
      }
    })

    // Sync to the database
    app.set('sequelizeSync', sequelize.sync())

    return result
  }
}
