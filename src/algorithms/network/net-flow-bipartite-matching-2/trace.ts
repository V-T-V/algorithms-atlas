// 最大流二分匹配 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxFlowBipartiteMatching, type BipartiteInput } from './impl.ts';

export const DEFAULT_INPUT: BipartiteInput = {
  nLeft: 3,
  nRight: 3,
  edges: [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 2],
    [2, 0],
    [2, 2],
  ],
};

export function buildTrace(input: BipartiteInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const result = maxFlowBipartiteMatching(input);

  const matched = new Set(result.pairs.map((p) => `${p.left}-${p.right}`));
  const nodes: GraphNode[] = [];
  for (let i = 0; i < input.nLeft; i++) {
    nodes.push({
      id: `L${i}`,
      label: `L${i}`,
      x: 0.25,
      y: (i + 1) / (input.nLeft + 1),
      role: 'default' as BarRole,
    });
  }
  for (let j = 0; j < input.nRight; j++) {
    nodes.push({
      id: `R${j}`,
      label: `R${j}`,
      x: 0.75,
      y: (j + 1) / (input.nRight + 1),
      role: 'default' as BarRole,
    });
  }
  const edges: GraphEdge[] = input.edges.map(([l, r]) => ({
    from: `L${l}`,
    to: `R${r}`,
    directed: true,
    role: (matched.has(`${l}-${r}`) ? 'final' : 'default') as BarRole,
  }));

  rec
    .begin({
      zh: `二分图：${input.nLeft}×${input.nRight}`,
      en: `Bipartite: ${input.nLeft}x${input.nRight}`,
    })
    .setGraph(nodes, edges)
    .commit();

  rec
    .begin({ zh: `最大匹配 = ${result.size}`, en: `Maximum matching = ${result.size}` })
    .setGraph(nodes, edges)
    .setAux(
      result.pairs.map((p) => ({
        label: `L${p.left}`,
        value: `R${p.right}`,
        role: 'final' as BarRole,
      })),
    )
    .commit();
  return rec.build();
}
