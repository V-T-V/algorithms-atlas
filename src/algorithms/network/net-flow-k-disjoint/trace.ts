// k 不相交路径 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kDisjointPaths, type FlowKDisjointInput, type FlowKDisjointHooks } from './impl.ts';

export const DEFAULT_INPUT: FlowKDisjointInput = {
  n: 5,
  edges: [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 1, to: 4 },
    { from: 2, to: 4 },
  ],
  s: 0,
  t: 4,
  k: 3,
};

export function buildTrace(input: FlowKDisjointInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const baseNodes: GraphNode[] = Array.from({ length: input.n }, (_, i) => ({
    id: String(i),
    label: String(i),
    x: i / (input.n - 1),
    y: i === input.s || i === input.t ? 0.8 : 0.4,
    role: i === input.s ? 'frontier' : i === input.t ? 'final' : 'default',
  }));
  const baseEdges: GraphEdge[] = input.edges.map((e) => ({
    from: String(e.from),
    to: String(e.to),
    directed: true,
  }));

  rec
    .begin({
      zh: `求 ${input.s}→${input.t} 至多 ${input.k} 条边不相交路径`,
      en: `Find up to ${input.k} edge-disjoint ${input.s}→${input.t} paths`,
    })
    .setGraph(baseNodes, baseEdges)
    .setAux([{ label: '方法', value: '单位容量最大流', role: 'pivot' }])
    .commit();

  const hooks: FlowKDisjointHooks = {
    onAugment: (path: number[], totalFlow: number) => {
      rec
        .begin({
          zh: `增广路 #${totalFlow}：${path.join('→')}`,
          en: `Augmenting path #${totalFlow}: ${path.join('→')}`,
        })
        .setGraph(baseNodes, baseEdges)
        .setAux([
          { label: `路径 ${totalFlow}`, value: path.join('→'), role: 'frontier' as BarRole },
        ])
        .commit();
    },
    onResult: (paths, maxFlow) => {
      rec
        .begin({
          zh: `共找到 ${maxFlow} 条边不相交路径`,
          en: `${maxFlow} edge-disjoint paths found`,
        })
        .setGraph(baseNodes, baseEdges)
        .setAux(
          paths.map((p, i) => ({
            label: `路径 ${i + 1}`,
            value: p.join('→'),
            role: 'final' as BarRole,
          })),
        )
        .commit();
    },
  };

  kDisjointPaths(input, hooks);
  return rec.build();
}
