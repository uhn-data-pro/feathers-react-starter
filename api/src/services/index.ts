import { Application } from '../declarations'
import registration from './registration/registration.service'
import users from './users/users.service'

export default function(app: Application): void {
  app.configure(users)
  app.configure(registration)
}
