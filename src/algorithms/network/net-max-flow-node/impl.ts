// 节点容量最大流 · 实现

import { fordFulkerson, type MaxFlowResult } from '../ford-fulkerson/impl.ts';

export interface NodeCapInput {
  nodes: ReadonlyArray<{ id: string; capacity: number }>;
  edges: ReadonlyArray<{ from: string; to: string; capacity: number }>;
  source: string;
  sink: string;
}

const IN = '_in';
const OUT = '_out';

/** 节点容量最大流：节点分裂后跑 Ford-Fulkerson。 */
export function nodeCapMaxFlow(input: NodeCapInput): MaxFlowResult {
  const edges: Array<{ from: string; to: string; capacity: number }> = [];
  for (const n of input.nodes)
    edges.push({ from: n.id + IN, to: n.id + OUT, capacity: n.capacity });
  for (const e of input.edges)
    edges.push({ from: e.from + OUT, to: e.to + IN, capacity: e.capacity });
  const nodes: string[] = [];
  for (const n of input.nodes) {
    nodes.push(n.id + IN);
    nodes.push(n.id + OUT);
  }
  return fordFulkerson({ nodes, edges, source: input.source + OUT, sink: input.sink + IN });
}
