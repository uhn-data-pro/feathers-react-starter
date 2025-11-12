// See docs for using sequelize with Typescript
// https://sequelize.org/docs/v6/other-topics/typescript/

import {
  Association,
  DataTypes,
  Model,
  type CreationOptional,
  type EnumDataType,
  type InferAttributes,
  type InferCreationAttributes,
  type ForeignKey,
  type NonAttribute
} from 'sequelize'

export class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  declare id: CreationOptional<typeof DataTypes.UUID> // Can be omitted when creating new instances
  declare email: string
  declare password: string
}
