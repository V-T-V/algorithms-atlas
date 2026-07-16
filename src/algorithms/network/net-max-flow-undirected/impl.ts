// 无向图最大流 · 实现

import { fordFulkerson, type MaxFlowResult } from '../ford-fulkerson/impl.ts';

export interface UndirectedFlowInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; capacity: number }>;
  source: string;
  sink: string;
}

/** 无向图最大流：每条无向边拆为两条有向边。 */
export function undirectedMaxFlow(input: UndirectedFlowInput): MaxFlowResult {
  const edges: Array<{ from: string; to: string; capacity: number }> = [];
  for (const e of input.edges) {
    edges.push({ from: e.from, to: e.to, capacity: e.capacity });
    edges.push({ from: e.to, to: e.from, capacity: e.capacity });
  }
  return fordFulkerson({ nodes: input.nodes, edges, source: input.source, sink: input.sink });
}
