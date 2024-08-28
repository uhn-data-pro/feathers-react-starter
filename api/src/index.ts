/* eslint-disable no-console */
import app from './app'
import logger from './logger'

const port = app.get('port')

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason))

app.listen(port).then(() => {
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
  try {
    app.io.emit('HELLO')
    app.io.on('connection', (socket: any) => {
      console.log('YAY')
    })
  } catch (e: any) {
    console.log(e)
  }

})
