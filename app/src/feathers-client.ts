import feathers from '@feathersjs/client';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';

import { BASE_URL } from './constants';

const app: any = feathers();
const socket = io(BASE_URL);

app.configure(socketio(socket, { timeout: 10000 })); // 10 second timeout

app.configure(feathers.authentication());

export { app as default };
