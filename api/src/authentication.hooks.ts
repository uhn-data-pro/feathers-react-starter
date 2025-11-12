// Authentication hooks
import { iff, isProvider } from 'feathers-hooks-common'
import get from 'lodash/get'
import pick from 'lodash/pick'

import { HookContext, HookOptions } from './declarations'
import { UserModel } from './models/declarations'

const userFieldsToReturn = [
  'id',
  'email', // may need to be updated to 'username'
]

const limitUserFieldsReturned = () => (context: HookContext) => {
  const user: UserModel = get(context, 'result.user')

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
