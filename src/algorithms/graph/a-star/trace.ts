// =============================================================================
// A* 寻路 · 录制帧序列
// 通过 aStar 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { aStar, reconstructPath, type AStarHooks, type GraphInput } from './impl.ts';

/** 演示用加权图：S 为源、T 为目标。带坐标便于欧氏启发。 */
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
export const DEFAULT_TARGET = 'T';

/** 归一化坐标：S 居左，T 居右，中间分层。 */
const POS: Record<string, { x: number; y: number }> = {
  S: { x: 0.12, y: 0.5 },
  A: { x: 0.38, y: 0.2 },
  B: { x: 0.38, y: 0.78 },
  C: { x: 0.62, y: 0.2 },
  D: { x: 0.62, y: 0.78 },
  T: { x: 0.9, y: 0.5 },
};

const fmt = (d: number): string => (Number.isFinite(d) ? d.toFixed(1) : '∞');

/** 欧氏启发函数（按归一化坐标，放大 10 倍使 h 与 g 同量级，仍 admissible）。 */
function euclideanHeuristic(node: string, target: string): number {
  const a = POS[node];
  const b = POS[target];
  if (!a || !b) return 0;
  const dx = (a.x - b.x) * 10;
  const dy = (a.y - b.y) * 10;
  return Math.sqrt(dx * dx + dy * dy);
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: GraphInput = DEFAULT_INPUT,
  source = DEFAULT_SOURCE,
  target = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const gScore = new Map<string, number>(nodeIds.map((n) => [n, Infinity]));
  const closed = new Set<string>();
  const open = new Set<string>();
  const treeEdges = new Set<string>();
  let popping: string | null = null;
  let examEdge: { from: string; to: string } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (closed.has(id)) role = 'final';
      if (open.has(id)) role = 'frontier';
      if (id === popping) role = 'pivot';
      const h = euclideanHeuristic(id, target);
      const g = gScore.get(id) ?? Infinity;
      const f = Number.isFinite(g) ? g + h : Infinity;
      return {
        id,
        label: `${id}\ng=${fmt(g)} h=${fmt(h)}${id === popping ? ` f=${fmt(f)}` : ''}`,
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

  gScore.set(source, 0);
  open.add(source);
  render({
    zh: `初始化：源 ${source} g=0，目标 ${target}；欧氏启发引导搜索`,
    en: `Init: ${source} g=0, target ${target}; Euclidean heuristic guides search`,
  });

  const hooks: AStarHooks = {
    onPop: (node, g, f) => {
      popping = node;
      open.delete(node);
      closed.add(node);
      render({
        zh: `弹出 ${node}（f=${fmt(f)}, g=${fmt(g)}）展开`,
        en: `Pop ${node} (f=${fmt(f)}, g=${fmt(g)}) to expand`,
      });
    },
    onRelax: (from, to, newG, f, improved) => {
      examEdge = { from, to };
      if (improved) {
        gScore.set(to, newG);
        open.add(to);
        treeEdges.add(`${from}>${to}`);
        // 前驱更新：移除指向 to 的其它树边
        for (const k of [...treeEdges]) {
          if (k !== `${from}>${to}` && k.endsWith(`>${to}`)) treeEdges.delete(k);
        }
      }
      render({
        zh: `松弛 ${from}→${to}：g=${fmt(newG)} f=${fmt(f)}${improved ? ' ✅ 更新' : '（不更优）'}`,
        en: `Relax ${from}→${to}: g=${fmt(newG)} f=${fmt(f)}${improved ? ' ✅ improved' : ' (no update)'}`,
      });
      examEdge = null;
    },
  };

  const result = aStar(input, source, target, euclideanHeuristic, hooks);

  // 终态：标出 source→target 的最短路径
  popping = null;
  const path = reconstructPath(result.prev, source, target);
  const pathEdges = new Set<string>();
  if (path) {
    for (let i = 0; i + 1 < path.length; i++) pathEdges.add(`${path[i]!}>${path[i + 1]!}`);
  }
  rec
    .begin({
      zh: result.found
        ? `完成，最短路径 ${source}→${target} = ${fmt(result.dist.get(target) ?? Infinity)}`
        : '目标不可达',
      en: result.found
        ? `Done, ${source}→${target} = ${fmt(result.dist.get(target) ?? Infinity)}`
        : 'Target unreachable',
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
