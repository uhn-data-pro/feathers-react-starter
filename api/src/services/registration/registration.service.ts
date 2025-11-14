// Initializes the `registration` service on path `/registration`
import { RegistrationService } from './registration.class'

import hooks from './registration.hooks'

import type { Application } from '../../declarations'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'registration': RegistrationService
  }
}

export default function (app: Application) {

  // Initialize our service with any options it requires
  app.use('registration', new RegistrationService(app))

  // Get our initialized service so that we can register hooks
  const service = app.service('registration')

  service.hooks(hooks)
}
