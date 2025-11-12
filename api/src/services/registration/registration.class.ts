import { BadRequest } from '@feathersjs/errors'
import pick from 'lodash/pick'

import { Application } from '../../declarations'
import { UserModel } from '../../models/declarations'


export class RegistrationService  {

  app: Application

  constructor(app: Application) {
    this.app = app
  }

  create(data : Partial<UserModel>) : Promise<UserModel>{
    const userToCreate = {
      ...pick(data, ['email', 'password' ])
    }
    return this.app.service('users').create(userToCreate)
      .catch((error : Error) => {
        console.log(error.message)
        throw new BadRequest('User cannot be registered')
      })
  }

}
