import { Application } from '../declarations'
import users from './users/users.service'
import registration from './registration/registration.service'

export default function(app: Application): void {
  app.configure(users)
  app.configure(registration)
}
