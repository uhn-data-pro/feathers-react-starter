// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Id } from '@feathersjs/feathers'
import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize'

import { Application, DBModel } from '../declarations'

export interface User extends DBModel {
  id: Id
  username: string
  password: string
  role: string
  created_at: Date
  updated_at: Date
}

export default function(app: Application): ModelStatic<Model> {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const users = sequelizeClient.define('users', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  (users as any).associate = function(models: any): void {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }

  return users
};
