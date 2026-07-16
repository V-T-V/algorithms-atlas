// 两点不相交路径 · 录制帧序列
import type { Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { twoDisjointPaths, type Flow2DisjointInput, type Flow2DisjointHooks } from './impl.ts';

export const DEFAULT_INPUT: Flow2DisjointInput = {
  n: 6,
  edges: [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 3, to: 5 },
    { from: 4, to: 5 },
    { from: 1, to: 4 },
    { from: 2, to: 5 },
  ],
  s: 0,
  t: 5,
};

export function buildTrace(input: Flow2DisjointInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = Array.from({ length: input.n }, (_, i) => String(i));

  const baseNodes: GraphNode[] = nodeIds.map((id, i) => ({
    id,
    label: id,
    x: (i % 3) * 0.3 + 0.1,
    y: Math.floor(i / 3) * 0.4 + 0.1,
    role: i === input.s ? 'frontier' : i === input.t ? 'final' : 'default',
  }));
  const baseEdges: GraphEdge[] = input.edges.map((e) => ({
    from: String(e.from),
    to: String(e.to),
    directed: true,
  }));

  rec
    .begin({
      zh: `在 ${input.n} 个点的有向图上找 ${input.s}→${input.t} 两条点不相交路径`,
      en: `Find two vertex-disjoint ${input.s}→${input.t} paths`,
    })
    .setGraph(baseNodes, baseEdges)
    .setAux([{ label: '方法', value: '点拆分 + 单位容量最大流', role: 'pivot' }])
    .commit();

  let aug = 0;
  const hooks: Flow2DisjointHooks = {
    onAugment: (path: number[], totalFlow: number) => {
      aug++;
      rec
        .begin({
          zh: `第 ${aug} 次增广，流量累加为 ${totalFlow}`,
          en: `Augment #${aug}, total flow ${totalFlow}`,
        })
        .setAux([{ label: '增广路（残量图节点）', value: JSON.stringify(path), role: 'frontier' }])
        .commit();
    },
    onResult: (paths) => {
      if (paths.length === 0) {
        rec
          .begin({ zh: '流量 < 2，不存在两条点不相交路径', en: 'Flow < 2: no two disjoint paths' })
          .setAux([{ label: '结论', value: '不存在', role: 'warn' }])
          .commit();
      } else {
        rec
          .begin({
            zh: `找到 ${paths.length} 条点不相交路径`,
            en: `Found ${paths.length} vertex-disjoint paths`,
          })
          .setGraph(baseNodes, baseEdges)
          .setAux(
            paths.map((p, i) => ({
              label: `路径 ${i + 1}`,
              value: p.join('→'),
              role: 'final' as const,
            })),
          )
          .commit();
      }
    },
  };

  twoDisjointPaths(input, hooks);

  return rec.build();
}
