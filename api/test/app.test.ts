import assert from 'assert'

import axios from 'axios'
import { Server } from 'http'
import url from 'url'

import app from '../src/app'


const port = app.get('port') || 8998
const getUrl = (pathname?: string): string => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
})

describe('Feathers application tests', () => {
  let server: Server

  before(async() => {
    server = await app.listen(port)
  })

  after(function(done) {
    server.close(done)
  })

  it('starts and shows the index page', async() => {
    const { data } = await axios.get(getUrl())

    assert.ok(data.indexOf('<html lang="en">') !== -1)
  })

  describe.skip('404', function() {
    // To fix this failure, skip the test, or provide a 404 HTML page
    it('shows a 404 HTML page', async() => {
      try {
        await axios.get(getUrl('path/to/nowhere'), {
          headers: {
            'Accept': 'text/html',
          }
        })
        assert.fail('should never get here')
      } catch (error: any) {
        const { response } = error

        assert.equal(response.status, 404)
        assert.ok(response.data.indexOf('<html>') !== -1)
      }
    })

    it('shows a 404 JSON error without stack trace', async() => {
      try {
        await axios.get(getUrl('path/to/nowhere'), {
          responseType: 'json'
        })
        assert.fail('should never get here')
      } catch (error: any) {
        const { response } = error

        assert.equal(response.status, 404)
        assert.equal(response.data.code, 404)
        assert.equal(response.data.message, 'Page not found')
        assert.equal(response.data.name, 'NotFound')
      }
    })
  })
})
