import authentication from '@feathersjs/authentication-client'
import { feathers } from '@feathersjs/client'
import socketio from '@feathersjs/socketio-client'
import { io } from 'socket.io-client'

import { BASE_URL, NODE_ENV } from './constants'

const socket = NODE_ENV === 'production'
  ? io(BASE_URL, { path: '/api/socket.io/' })
  : io(BASE_URL)

const app: any = feathers()

const storage = window.sessionStorage

app.configure(socketio(socket))
app.configure(authentication({ storage: storage }))

export { app as default }
