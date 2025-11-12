import { authenticate } from '@feathersjs/authentication'
import * as local from '@feathersjs/authentication-local'
import {
  disallow,
  discard,
  iff,
  isProvider,
} from 'feathers-hooks-common'
import get from 'lodash/get'

const { hashPassword } = local.hooks
import type { HookOptions, HookContext } from '../../declarations'
import type { Users } from './users.class'

const USER_SENSITIVE_FIELDS = ['password', 'participant.mrn', 'verifyToken', 'resetToken']

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
    find: [
      disallow('external')
    ],
    get: [
      iff(isProvider('external'), restrictToUser())
    ],
    create: [
      hashPassword('password')
    ],
    update: [
      hashPassword('password')
    ],
    patch: [
      hashPassword('password')
    ],
    remove: [
      disallow('external')
    ]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      discard(...USER_SENSITIVE_FIELDS)
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
