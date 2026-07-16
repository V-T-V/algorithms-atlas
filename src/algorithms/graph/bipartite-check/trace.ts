// =============================================================================
// 二分图判定 · 录制帧序列
// setGraph 展示无向图：颜色 0 用 'compare'、颜色 1 用 'frontier'；
// 当前检查的边标 'swap'，发现冲突的边标 'warn'。
// 已确认的二分划分别用 setAux 展示。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bipartiteCheck, type BipartiteCheckHooks, type BipartiteCheckInput } from './impl.ts';

/** 演示用无向图：可二分（两部分 A={1,3,5}, B={2,4,6}）。 */
export const DEFAULT_INPUT: BipartiteCheckInput = {
  nodes: ['1', '2', '3', '4', '5', '6'],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '4' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '6' },
    { from: '6', to: '1' },
    { from: '2', to: '5' },
  ],
};

/** 归一化坐标：两列布局（运行时按实际颜色再调，此处给一个合理初值）。 */
const POS: Record<string, { x: number; y: number }> = {
  '1': { x: 0.25, y: 0.2 },
  '3': { x: 0.25, y: 0.5 },
  '5': { x: 0.25, y: 0.8 },
  '2': { x: 0.75, y: 0.2 },
  '4': { x: 0.75, y: 0.5 },
  '6': { x: 0.75, y: 0.8 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: BipartiteCheckInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const color = new Map<string, number>();
  let examEdge: { from: string; to: string } | null = null;
  let conflictEdge: { from: string; to: string } | null = null;
  let settling: string | null = null;

  const roleForColor = (c: number | undefined): BarRole => {
    if (c === undefined) return 'default';
    return c === 0 ? 'compare' : 'frontier';
  };

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role = roleForColor(color.get(id));
      if (id === settling) role = 'pivot';
      return {
        id,
        label: color.has(id) ? `${id}(${color.get(id)})` : id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      // 若两端都已染色：合法边
      if (color.has(e.from) && color.has(e.to)) role = 'final';
      if (examEdge && examEdge.from === e.from && examEdge.to === e.to) role = 'swap';
      else if (examEdge && examEdge.from === e.to && examEdge.to === e.from) role = 'swap';
      if (
        conflictEdge &&
        ((conflictEdge.from === e.from && conflictEdge.to === e.to) ||
          (conflictEdge.from === e.to && conflictEdge.to === e.from))
      )
        role = 'warn';
      return { from: e.from, to: e.to, role };
    });
    const color0 = nodeIds.filter((n) => color.get(n) === 0).sort();
    const color1 = nodeIds.filter((n) => color.get(n) === 1).sort();
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        {
          label: '色 0 集 / part 0',
          value: color0.length ? color0.join(',') : '—',
          role: 'compare',
        },
        {
          label: '色 1 集 / part 1',
          value: color1.length ? color1.join(',') : '—',
          role: 'frontier',
        },
      ])
      .commit();
  };

  render({
    zh: `无向图：${nodeIds.length} 节点 ${input.edges.length} 边`,
    en: `Undirected: ${nodeIds.length} nodes, ${input.edges.length} edges`,
  });

  const hooks: BipartiteCheckHooks = {
    onComponentStart: (source) => {
      render({
        zh: `新连通分量，从 ${source} 起，染 0`,
        en: `New component, start ${source} colored 0`,
      });
    },
    onColor: (node, c) => {
      color.set(node, c);
      settling = node;
      render({ zh: `染 ${node} 为颜色 ${c}`, en: `Color ${node} with ${c}` });
      settling = null;
    },
    onExamineEdge: (u, v, conflict) => {
      examEdge = { from: u, to: v };
      if (conflict) conflictEdge = { from: u, to: v };
      render({
        zh: conflict
          ? `边 ${u}—${v}：两端同色 ${color.get(u)}，发现奇环！`
          : `边 ${u}—${v}：两端异色，合法`,
        en: conflict
          ? `Edge ${u}—${v}: same color ${color.get(u)}, odd cycle!`
          : `Edge ${u}—${v}: opposite colors, ok`,
      });
      examEdge = null;
    },
    onDone: (bip) => {
      render({
        zh: bip ? `染色完成，图是二分图` : `发现冲突，图不是二分图`,
        en: bip ? `Coloring complete, graph is bipartite` : `Conflict found, not bipartite`,
      });
    },
  };

  const result = bipartiteCheck(input, hooks);

  // 终态
  examEdge = null;
  rec
    .begin({
      zh: result.bipartite ? `判定：是二分图` : `判定：非二分图`,
      en: result.bipartite ? `Verdict: bipartite` : `Verdict: not bipartite`,
    })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: color.has(id) ? `${id}(${color.get(id)})` : id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: roleForColor(color.get(id)),
      })),
      input.edges.map((e) => ({
        from: e.from,
        to: e.to,
        role: (result.bipartite ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([
      {
        label: '结论 / verdict',
        value: result.bipartite ? '二分图 / bipartite' : '非二分 / not bipartite',
        role: result.bipartite ? ('final' as BarRole) : ('warn' as BarRole),
      },
      {
        label: '冲突边 / conflict',
        value: result.conflictEdge
          ? `${result.conflictEdge.from}—${result.conflictEdge.to}`
          : '无 / none',
        role: 'warn',
      },
    ])
    .commit();

  return rec.build();
}
