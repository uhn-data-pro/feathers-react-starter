// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  Sequelize,
} from "sequelize"

import { Application, DBModelStatic } from "../declarations"

// See docs for using sequelize with Typescript
// https://sequelize.org/docs/v6/other-topics/typescript/
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<typeof DataTypes.UUID> // Can be omitted when creating new instances
  declare email: string
  declare password: string
  declare created_at: CreationOptional<Date>
  declare updated_at: CreationOptional<Date>
}

export default function (app: Application): ModelStatic<Model> {
  const sequelizeClient: Sequelize = app.get("sequelizeClient")
  const users = <DBModelStatic<User>>sequelizeClient.define("users", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })

  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  users.associate = function (models: Model[]): void {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }

  return users
}
