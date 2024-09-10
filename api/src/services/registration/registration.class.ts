
const { BadRequest } = require('@feathersjs/errors')

import { Params } from '@feathersjs/feathers'

const pick = require('lodash/pick')

import { User } from '../../models/users.model'
import { Application } from '../../declarations'


export class RegistrationService  {

  app: Application

  constructor(app: Application) {
    this.app = app
  }

  create(data : any) : Promise<User>{
    const userToCreate = {
      ...pick(data, ['email', 'password' ])
    }
    return this.app.service('users').create(userToCreate)
    .catch((error : Error) => {
      console.log(error.message)
      throw new BadRequest('User cannot be registered')
    })
  }

};