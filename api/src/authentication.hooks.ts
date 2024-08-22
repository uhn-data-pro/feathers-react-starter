// Authentication hooks
import { iff, isProvider } from 'feathers-hooks-common'
import get from 'lodash/get'
import pick from 'lodash/pick'

import { HookContext, HookOptions } from './declarations'
import { User } from './models/users.model'

const userFieldsToReturn = [
  'username', // may need to be updated to 'email'
]

const limitUserFieldsReturned = () => (context: HookContext) => {
  const user: User = get(context, 'result.user')

  if (user) {
    context.result.user = pick(user, userFieldsToReturn)
  }

  return context
}

const hooks: HookOptions = {
  around: {
    all: [],
    create: [],
    remove: []
  },

  before: {
    all: [],
    create: [],
    remove: []
  },

  after: {
    all: [
      iff(isProvider('external'), limitUserFieldsReturned()),
    ],
    create: [],
    remove: []
  },

  error: {
    all: [],
    create: [],
    remove: []
  }
}

export default hooks
