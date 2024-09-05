// A hook that logs service methods around, before, after and error
// Hides authorization headers and logged-in user's password
import { get, omit } from 'lodash'
import * as uuid from 'uuid'

import { HookContext, NextFunction } from '../declarations'

export default () => {
  return async function(hook: HookContext, next?: NextFunction) {
    try {
      let message = `${ hook.type }: ${ hook.path } - Method: ${ hook.method }`
      if (hook.type === 'error') {
        message += `: ${ get(hook, 'error.message', 'No error object found on hook') }`
      }

      const meta = {
        event_id: uuid.v4(),
        method: hook.method,
        service: hook.path,
        type: hook.type,
        audit: true,
        time: new Date().toISOString(),
        data: hook.data,
        params: hook.params ? omit(hook.params, [ 'headers.authorization', 'user.password' ]) : undefined,
        response_body: hook.result && hook.result.data ? hook.result.data : hook.result,
        prior_values: hook.prior_values,
        error: hook.error
      }

      // Only audit external requests
      if (process.env.ENVIRONMENT === 'production' && hook.params && hook.params.provider === 'rest') {
        console.log(`Wrote audit event id ${meta.event_id}`)
        hook.app.get('auditLogger').info(message, omit(meta, [ 'data.password' ]))
      } else if (process.env.ENVIRONMENT === 'development') {
        console.log(message)
      }

      if (hook.type === 'around' && next !== undefined) {
        await next()
      }
    } catch (err) {
      if (hook.error) throw err
      console.error(err)
    }
  }
}
