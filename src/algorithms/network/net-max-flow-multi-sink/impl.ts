// 多汇最大流 · 实现

import { fordFulkerson, type MaxFlowResult } from '../ford-fulkerson/impl.ts';

export interface MultiSinkInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; capacity: number }>;
  source: string;
  sinks: ReadonlyArray<{ id: string; demand: number }>;
}

const SUPER = '__SUPER_SNK__';

/** 多汇最大流：加超级汇点后跑 Ford-Fulkerson。 */
export function multiSinkMaxFlow(input: MultiSinkInput): MaxFlowResult {
  const edges = [...input.edges];
  for (const t of input.sinks) edges.push({ from: t.id, to: SUPER, capacity: t.demand });
  const nodes = [...input.nodes, SUPER];
  return fordFulkerson({ nodes, edges, source: input.source, sink: SUPER });
}
