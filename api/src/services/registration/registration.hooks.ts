import { RegistrationService } from './registration.class'
import { HookOptions } from '../../declarations'

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
