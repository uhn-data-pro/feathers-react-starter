// Application hooks that run for every service
import { iff, isProvider } from 'feathers-hooks-common'

import { HookOptions } from './declarations'
import { logger, trimWhitespace } from './hooks'

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
    create: [ iff(isProvider('external'), trimWhitespace()) ],
    update: [],
    patch: [ iff(isProvider('external'), trimWhitespace()) ],
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
