import * as local from '@feathersjs/authentication-local'

const { protect } = local.hooks

import { HookOptions } from '../../declarations'

import { RegistrationService } from './registration.class'

const hooks: HookOptions<RegistrationService> = {
  around: {
    all: [],
    create: []
  },

  before: {
    all: [],
    create: []
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    create: []
  },

  error: {
    all: [],
    create: []
  }
}

export default hooks
