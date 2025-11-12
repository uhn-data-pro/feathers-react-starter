// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes } from 'sequelize'

import { UserModel } from './declarations'

import type { Application, ModelStatic } from '../declarations'

function createModel(app: Application): ModelStatic<UserModel> {
  const sequelizeClient = app.get('sequelizeClient')
  const users = <ModelStatic<UserModel>>sequelizeClient.define('users', {
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
  })

  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  users.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }

  return users
};

export default createModel
