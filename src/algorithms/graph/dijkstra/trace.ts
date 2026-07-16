// =============================================================================
// Dijkstra 最短路径 · 录制帧序列
// 通过 dijkstra 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dijkstra, reconstructPath, type DijkstraHooks, type GraphInput } from './impl.ts';

/** 演示用加权图：S 为源。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['S', 'A', 'B', 'C', 'D', 'T'],
  edges: [
    { from: 'S', to: 'A', weight: 4 },
    { from: 'S', to: 'B', weight: 2 },
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'A', weight: 1 },
    { from: 'B', to: 'C', weight: 8 },
    { from: 'B', to: 'D', weight: 10 },
    { from: 'C', to: 'D', weight: 2 },
    { from: 'C', to: 'T', weight: 6 },
    { from: 'D', to: 'T', weight: 3 },
  ],
};

export const DEFAULT_SOURCE = 'S';

/** 归一化坐标：S 居左，T 居右，中间分层。 */
const POS: Record<string, { x: number; y: number }> = {
  S: { x: 0.12, y: 0.5 },
  A: { x: 0.38, y: 0.2 },
  B: { x: 0.38, y: 0.78 },
  C: { x: 0.62, y: 0.2 },
  D: { x: 0.62, y: 0.78 },
  T: { x: 0.9, y: 0.5 },
};

const fmt = (d: number): string => (Number.isFinite(d) ? String(d) : '∞');

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT, source = DEFAULT_SOURCE): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const dist = new Map<string, number>(nodeIds.map((n) => [n, Infinity]));
  const settled = new Set<string>();
  const treeEdges = new Set<string>();
  let settling: string | null = null;
  let examEdge: { from: string; to: string } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (settled.has(id)) role = 'final';
      if (id === settling) role = 'pivot';
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
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  dist.set(source, 0);
  render({ zh: `初始化：源 ${source}=0，其余为 ∞`, en: `Init: ${source}=0, others ∞` });

  const hooks: DijkstraHooks = {
    onInit: () => {
      /* 已在调用前渲染初态 */
    },
    onSettle: (node, d) => {
      settling = node;
      settled.add(node);
      render({
        zh: `选定 ${node}（当前最小 dist=${d}）为已确定`,
        en: `Settle ${node} (min dist=${d})`,
      });
    },
    onRelax: (from, to, newDist, improved) => {
      examEdge = { from, to };
      if (improved) {
        dist.set(to, newDist);
        treeEdges.add(`${from}>${to}`);
        // 移除指向 to 的其它树边（前驱更新）
        for (const k of [...treeEdges]) {
          if (k !== `${from}>${to}` && k.endsWith(`>${to}`)) treeEdges.delete(k);
        }
      }
      render({
        zh: `松弛 ${from}→${to}：候选 ${newDist}${improved ? ' ✅ 更新' : '（不更优）'}`,
        en: `Relax ${from}→${to}: ${newDist}${improved ? ' ✅ improved' : ' (no update)'}`,
      });
      examEdge = null;
    },
  };

  const result = dijkstra(input, source, hooks);

  // 终态：标出 source→T 的最短路径
  settling = null;
  const target = nodeIds.find((n) => n !== source && n === 'T') ?? nodeIds[nodeIds.length - 1]!;
  const path = reconstructPath(result.prev, source, target);
  const pathEdges = new Set<string>();
  if (path) {
    for (let i = 0; i + 1 < path.length; i++) pathEdges.add(`${path[i]!}>${path[i + 1]!}`);
  }
  rec
    .begin({
      zh: path
        ? `完成，最短路径 ${source}→${target} = ${fmt(result.dist.get(target) ?? Infinity)}`
        : '搜索完成',
      en: path ? `Done, ${source}→${target} = ${fmt(result.dist.get(target) ?? Infinity)}` : 'Done',
    })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: `${id}=${fmt(result.dist.get(id) ?? Infinity)}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: 'final' as BarRole,
      })),
      input.edges.map((e) => ({
        from: e.from,
        to: e.to,
        weight: e.weight,
        directed: input.directed,
        role: (pathEdges.has(`${e.from}>${e.to}`) ? 'final' : 'default') as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
