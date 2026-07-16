// 多源最大流 · 实现

import { fordFulkerson, type MaxFlowResult } from '../ford-fulkerson/impl.ts';

export interface MultiSourceInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; capacity: number }>;
  sources: ReadonlyArray<{ id: string; supply: number }>;
  sink: string;
}

const SUPER = '__SUPER_SRC__';

/** 多源最大流：加超级源点后跑 Ford-Fulkerson。 */
export function multiSourceMaxFlow(input: MultiSourceInput): MaxFlowResult {
  const edges = [...input.edges];
  for (const s of input.sources) edges.push({ from: SUPER, to: s.id, capacity: s.supply });
  const nodes = [...input.nodes, SUPER];
  return fordFulkerson({ nodes, edges, source: SUPER, sink: input.sink });
}
