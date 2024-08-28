import authentication from '@feathersjs/authentication-client'
import feathers from '@feathersjs/client'
import socketio from '@feathersjs/socketio-client'
import { io } from 'socket.io-client'

import { BASE_URL, NODE_ENV } from './constants'

console.log(NODE_ENV)
const socket = NODE_ENV === 'production'
  ? io(BASE_URL, { path: '/api/socket.io/' })
  : io(BASE_URL, {
    transports: [ 'websocket' ],
    withCredentials: true
  })

console.log(socket)
const app: any = feathers()

const storage = window.sessionStorage

app.configure(socketio(socket))
app.configure(authentication({ storage: storage }))

socket.on('connect_error', (err: any) => {
  console.log(err instanceof Error) // true
  // the reason of the error, for example "xhr poll error"
  console.log(err.message)

  // some additional description, for example the status code of the initial HTTP response
  console.log(err.description)
  console.log(JSON.stringify(err)) // not authorized
})

export { app as default }
