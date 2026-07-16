// =============================================================================
// Bellman-Ford 最短路径 · 录制帧序列
// 通过 bellmanFord 的钩子，把执行过程录成 Frame[]。
// 支持/展示负权边：松弛中的边标 compare，最短路树标 final，负环标 warn。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bellmanFord, type BellmanFordHooks, type GraphInput } from './impl.ts';

/** 演示用加权图（含负权，但无负环）。S 为源。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['S', 'A', 'B', 'C', 'D', 'T'],
  edges: [
    { from: 'S', to: 'A', weight: 6 },
    { from: 'S', to: 'B', weight: 7 },
    { from: 'A', to: 'B', weight: 8 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'C', weight: -3 },
    { from: 'B', to: 'D', weight: 9 },
    { from: 'C', to: 'A', weight: -2 },
    { from: 'D', to: 'C', weight: 7 },
    { from: 'D', to: 'T', weight: 1 },
    { from: 'T', to: 'D', weight: 2 },
  ],
  directed: true,
};

export const DEFAULT_SOURCE = 'S';

/** 归一化坐标：S 居左，T 居右，中间分层。 */
const POS: Record<string, { x: number; y: number }> = {
  S: { x: 0.1, y: 0.5 },
  A: { x: 0.32, y: 0.18 },
  B: { x: 0.32, y: 0.82 },
  C: { x: 0.55, y: 0.5 },
  D: { x: 0.77, y: 0.18 },
  T: { x: 0.9, y: 0.5 },
};

const fmt = (d: number): string => {
  if (d === Infinity) return '∞';
  if (d === -Infinity) return '-∞';
  return String(d);
};

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT, source = DEFAULT_SOURCE): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const dist = new Map<string, number>(nodeIds.map((n) => [n, Infinity]));
  const treeEdges = new Set<string>();
  const negative = new Set<string>();
  let round = 0;
  let examEdge: { from: string; to: string } | null = null;

  const distAux = (): Array<{ label: string; value: string; role?: BarRole }> => {
    const entries = nodeIds.map((id) => ({
      label: id,
      value: fmt(dist.get(id) ?? Infinity),
      role: (negative.has(id)
        ? 'warn'
        : dist.get(id) !== Infinity
          ? 'final'
          : 'default') as BarRole,
    }));
    return [
      { label: 'round', value: round === 0 ? '-' : String(round), role: 'pivot' as BarRole },
      ...entries,
    ];
  };

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (negative.has(id)) role = 'warn';
      else if (dist.get(id) !== Infinity) role = 'final';
      return {
        id,
        label: `${id}=${fmt(dist.get(id) ?? Infinity)}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (treeEdges.has(`${e.from}>${e.to}`)) role = 'final';
      if (examEdge && examEdge.from === e.from && examEdge.to === e.to) role = 'compare';
      return { from: e.from, to: e.to, weight: e.weight, directed: input.directed, role };
    });
    rec.begin(note).setGraph(nodes, edges).setAux(distAux()).commit();
  };

  dist.set(source, 0);
  render({ zh: `初始化：源 ${source}=0，其余为 ∞`, en: `Init: ${source}=0, others ∞` });

  const hooks: BellmanFordHooks = {
    onInit: () => {
      /* 已在调用前渲染初态 */
    },
    onRound: (r) => {
      round = r;
    },
    onRelax: (from, to, newDist, improved) => {
      examEdge = { from, to };
      if (improved) {
        dist.set(to, newDist);
        treeEdges.add(`${from}>${to}`);
        // 指向 to 的其它树边失效（前驱更新）
        for (const k of [...treeEdges]) {
          if (k !== `${from}>${to}` && k.endsWith(`>${to}`)) treeEdges.delete(k);
        }
      }
      render({
        zh: `第 ${round} 轮：松弛 ${from}→${to}（候选 ${fmt(newDist)}）${improved ? ' ✅ 更新' : '（不更优）'}`,
        en: `Round ${round}: relax ${from}→${to} (${fmt(newDist)})${improved ? ' ✅ improved' : ' (no update)'}`,
      });
      examEdge = null;
    },
    onNegativeEdge: (from, to) => {
      examEdge = { from, to };
      negative.add(from);
      negative.add(to);
      render({
        zh: `⚠ 检测到负环：第 ${nodeIds.length} 轮仍可松弛 ${from}→${to}`,
        en: `⚠ Negative cycle: round ${nodeIds.length} still relaxes ${from}→${to}`,
      });
      examEdge = null;
    },
    onDone: (hasNeg) => {
      round = nodeIds.length;
      // 标注最终距离（负环点已在 dist 中置 -∞，由 impl 完成）
      const target = nodeIds.find((n) => n === 'T') ?? nodeIds[nodeIds.length - 1]!;
      rec
        .begin(
          hasNeg
            ? { zh: `完成（含负环，受影响节点距离为 -∞）`, en: `Done (negative cycle detected)` }
            : {
                zh: `完成，${source}→${target} = ${fmt(dist.get(target) ?? Infinity)}`,
                en: `Done, ${source}→${target} = ${fmt(dist.get(target) ?? Infinity)}`,
              },
        )
        .setGraph(
          nodeIds.map((id) => ({
            id,
            label: `${id}=${fmt(dist.get(id) ?? Infinity)}`,
            x: POS[id]?.x ?? 0.5,
            y: POS[id]?.y ?? 0.5,
            role: (negative.has(id) ? 'warn' : 'final') as BarRole,
          })),
          input.edges.map((e) => ({
            from: e.from,
            to: e.to,
            weight: e.weight,
            directed: input.directed,
            role: (treeEdges.has(`${e.from}>${e.to}`) ? 'final' : 'default') as BarRole,
          })),
        )
        .setAux(distAux())
        .commit();
    },
  };

  const result = bellmanFord(input, source, hooks);
  // 同步负环影响点，便于末帧一致（虽然 onDone 已渲染）
  for (const id of result.negative) negative.add(id);

  return rec.build();
}
