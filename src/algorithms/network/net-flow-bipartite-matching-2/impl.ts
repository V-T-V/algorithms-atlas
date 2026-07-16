// 最大流二分匹配 · 实现

import { fordFulkerson } from '../ford-fulkerson/impl.ts';

export interface BipartiteInput {
  nLeft: number;
  nRight: number;
  edges: ReadonlyArray<readonly [number, number]>;
}

export interface MatchingResult {
  size: number;
  pairs: Array<{ left: number; right: number }>;
}

const S = '__BPM_S__';
const T = '__BPM_T__';

/** 二分图最大匹配（最大流归约）。 */
export function maxFlowBipartiteMatching(input: BipartiteInput): MatchingResult {
  const { nLeft, nRight, edges } = input;
  const L = (i: number): string => `L${i}`;
  const R = (i: number): string => `R${i}`;
  const nodes: string[] = [S, T];
  for (let i = 0; i < nLeft; i++) nodes.push(L(i));
  for (let j = 0; j < nRight; j++) nodes.push(R(j));

  const flowEdges: Array<{ from: string; to: string; capacity: number }> = [];
  for (let i = 0; i < nLeft; i++) flowEdges.push({ from: S, to: L(i), capacity: 1 });
  for (let j = 0; j < nRight; j++) flowEdges.push({ from: R(j), to: T, capacity: 1 });
  for (const [l, r] of edges) flowEdges.push({ from: L(l), to: R(r), capacity: 1 });

  const result = fordFulkerson({ nodes, edges: flowEdges, source: S, sink: T });
  const pairs: Array<{ left: number; right: number }> = [];
  for (const e of edges) {
    const [l, r] = e;
    const fe = result.flows.find((f) => f.from === L(l) && f.to === R(r));
    if (fe && fe.flow === 1) pairs.push({ left: l, right: r });
  }
  return { size: result.maxFlow, pairs };
}
