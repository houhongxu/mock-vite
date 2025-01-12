import type { Plugin as RollupPlugin } from 'rollup'

export interface Plugin<A = any> extends RollupPlugin<A> {}
