import * as feathersAuthentication from '@feathersjs/authentication'
import * as local from '@feathersjs/authentication-local'
import { disallow, iff, isProvider } from 'feathers-hooks-common'
import get from 'lodash/get'
import { HookContext, HookOptions } from '../../declarations'

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
    all: [],
    create: []
  },

  error: {
    all: [],
    create: []
  }
}

export default hooks
