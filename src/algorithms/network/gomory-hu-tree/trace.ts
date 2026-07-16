// =============================================================================
// Gomory-Hu 树 · 录制帧序列
// 用 setGraph 展示原图与逐步生成的树边；setAux 展示当前树边列表。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gomoryHuTree, type GhEdgeInput, type GhHooks } from './impl.ts';

/** 演示：4 节点无向图（环+对角）。 */
export const DEFAULT_INPUT = {
  n: 4,
  edges: [
    { from: 0, to: 1, cap: 3 },
    { from: 1, to: 2, cap: 4 },
    { from: 2, to: 3, cap: 3 },
    { from: 3, to: 0, cap: 4 },
    { from: 0, to: 2, cap: 2 },
  ] as GhEdgeInput[],
};

const POS: Record<number, { x: number; y: number }> = {
  0: { x: 0.2, y: 0.25 },
  1: { x: 0.8, y: 0.25 },
  2: { x: 0.8, y: 0.75 },
  3: { x: 0.2, y: 0.75 },
};

export function buildTrace(input: { n: number; edges: GhEdgeInput[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, edges } = input;
  const treeEdges: number[][] = [];
  const currentTreeEdges = new Set<string>();

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [];
    for (let i = 0; i < n; i++) {
      nodes.push({
        id: String(i),
        label: String(i),
        x: POS[i]?.x ?? 0.5,
        y: POS[i]?.y ?? 0.5,
        role: 'default',
      });
    }
    // 原图边（灰）+ 树边（高亮）
    const e2: GraphEdge[] = edges.map((e) => ({
      from: String(e.from),
      to: String(e.to),
      weight: e.cap,
      directed: false,
      role: 'default',
    }));
    for (const te of treeEdges) {
      const u = te[0]!;
      const v = te[1]!;
      const w = te[2]!;
      e2.push({
        from: String(u),
        to: String(v),
        weight: w,
        directed: false,
        role: currentTreeEdges.has(`${u}-${v}`) ? 'compare' : 'final',
      });
    }
    const aux = [
      {
        label: '已生成树边',
        value: String(treeEdges.length),
        role: 'frontier' as BarRole,
      },
      ...treeEdges.map((te) => ({
        label: `${te[0]} — ${te[1]}`,
        value: String(te[2]),
        role: 'final' as BarRole,
      })),
    ];
    rec.begin(note).setGraph(nodes, e2).setAux(aux).commit();
  };

  render({ zh: `初始无向图：${n} 节点`, en: `Initial undirected graph: ${n} nodes` });

  const hooks: GhHooks = {
    onVertex: (v, parent) => {
      render({
        zh: `处理节点 ${v}（父 ${parent}）：求 ${parent}-${v} 最大流`,
        en: `Process node ${v} (parent ${parent}): max-flow ${parent}-${v}`,
      });
    },
    onFlow: (v, parent, weight) => {
      treeEdges.push([parent, v, weight]);
      currentTreeEdges.clear();
      currentTreeEdges.add(`${parent}-${v}`);
      render({
        zh: `添加树边 ${parent}—${v}（权 ${weight}）`,
        en: `Tree edge ${parent}—${v} added (weight ${weight})`,
      });
      currentTreeEdges.clear();
    },
  };

  gomoryHuTree(n, edges, hooks);

  // 终态
  const nodes: GraphNode[] = [];
  for (let i = 0; i < n; i++) {
    nodes.push({
      id: String(i),
      label: String(i),
      x: POS[i]?.x ?? 0.5,
      y: POS[i]?.y ?? 0.5,
      role: 'final',
    });
  }
  rec
    .begin({
      zh: `完成，Gomory-Hu 树共 ${treeEdges.length} 条边`,
      en: `Done, Gomory-Hu tree has ${treeEdges.length} edges`,
    })
    .setGraph(
      nodes,
      treeEdges.map((te) => ({
        from: String(te[0]),
        to: String(te[1]),
        weight: te[2],
        directed: false,
        role: 'final' as BarRole,
      })),
    )
    .setAux(
      treeEdges.map((te) => ({
        label: `${te[0]} — ${te[1]}`,
        value: String(te[2]),
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
