import { Application } from '../declarations'
import users from './users/users.service'

// eslint-disable-next-line no-unused-vars
export default function(app: Application): void {
  app.configure(users)
}
