// Application hooks that run for every service
import { logger } from './hooks'
import { HookOptions } from './declarations'


const hooks: HookOptions = {
  around: {
    all: [
      logger()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  before: {
    all: [
      logger()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      logger()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [
      logger()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}

export default hooks
