import { checkContext, traverse } from 'feathers-hooks-common'

import type { HookContext } from '../declarations'
import type { TraverseContext } from 'neotraverse/legacy'


const trimWhitespace = () => (context: HookContext) => {
  checkContext(context, 'before', [ 'create', 'patch' ])

  // this was mostly copied from https://hooks-common.feathersjs.com/hooks.html#traverse
  function trimmer(this: TraverseContext, node: any) {
    if (typeof node === 'string') {
      this.update(node.trim())
    }
  }

  return traverse<HookContext>(trimmer, context => context.data)(context)
}

export default trimWhitespace
