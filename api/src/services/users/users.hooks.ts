import * as feathersAuthentication from '@feathersjs/authentication'
import * as local from '@feathersjs/authentication-local'
import get from 'lodash/get'

import { HookContext, HookOptions } from '../../declarations'
import { Users } from './users.class'

const { authenticate } = feathersAuthentication.hooks
const { hashPassword, protect } = local.hooks


const restrictToUser = () => async(context: HookContext) => {
  context.id = get(context.params, 'user.id')
  return context
}

const hooks: HookOptions<Users> = {
  around: {
    all: [
      authenticate('jwt')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  before: {
    all: [],
    find: [],
    get: [],
    create: [
      hashPassword('password')
    ],
    update: [
      hashPassword('password')
    ],
    patch: [
      hashPassword('password')
    ],
    remove: []
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}

export default hooks
