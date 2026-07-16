// =============================================================================
// 广度优先搜索 · 录制帧序列
// 通过 bfs 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bfs, type BfsHooks, type GraphInput } from './impl.ts';

/** 演示用无向图：1 为中心，呈「星形 + 环」便于看到分层扩展。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['1', '2', '3', '4', '5', '6', '7'],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '1', to: '4' },
    { from: '2', to: '5' },
    { from: '3', to: '6' },
    { from: '4', to: '7' },
    { from: '5', to: '6' },
    { from: '6', to: '7' },
  ],
};

/** 默认起点。 */
export const DEFAULT_START = '1';

/** 给节点排定 0~1 归一化坐标：1 居中，其余顺时针环形。 */
const POS: Record<string, { x: number; y: number }> = (() => {
  const ring = ['2', '5', '6', '3', '7', '4'];
  const cx = 0.5;
  const cy = 0.45;
  const r = 0.32;
  const pos: Record<string, { x: number; y: number }> = { '1': { x: cx, y: cy } };
  ring.forEach((id, i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / ring.length;
    pos[id] = { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) };
  });
  return pos;
})();

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT, start = DEFAULT_START): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;
  const directed = input.directed ?? false;

  // —— 可变状态：用于渲染每一帧 ——
  const visited = new Set<string>(); // 已发现（含在队列里）
  let visiting: string | null = null; // 当前正在展开的节点
  const treeEdges = new Set<string>(); // BFS 树已纳入的边（无向用规范 key）
  let examEdge: { from: string; to: string } | null = null; // 当前检查的边
  const queue: string[] = [];

  const edgeKey = (a: string, b: string): string =>
    directed ? `${a}>${b}` : a < b ? `${a}-${b}` : `${b}-${a}`;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (visited.has(id)) role = 'frontier';
      if (id === visiting) role = 'compare';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (treeEdges.has(edgeKey(e.from, e.to))) role = 'frontier';
      if (
        examEdge &&
        ((examEdge.from === e.from && examEdge.to === e.to) ||
          (!directed && examEdge.from === e.to && examEdge.to === e.from))
      ) {
        role = 'compare';
      }
      return { from: e.from, to: e.to, weight: e.weight, directed, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([{ label: 'Queue', value: queue.length ? queue.join(' → ') : '∅', role: 'frontier' }])
      .commit();
  };

  render({
    zh: `图共 ${nodeIds.length} 个节点，从 ${start} 开始广度优先搜索`,
    en: `${nodeIds.length} nodes; BFS from ${start}`,
  });

  const hooks: BfsHooks = {
    onDiscover: (node, parent) => {
      visited.add(node);
      queue.push(node);
      if (parent) treeEdges.add(edgeKey(parent, node));
      render({
        zh: `发现 ${node}${parent ? `（来自 ${parent}）` : '（起点）'}，入队`,
        en: `Discover ${node}${parent ? ` (from ${parent})` : ' (start)'}, enqueue`,
      });
    },
    onVisit: (node) => {
      visiting = node;
      // 出队：移除队列首
      const idx = queue.indexOf(node);
      if (idx >= 0) queue.splice(idx, 1);
      render({
        zh: `出队并访问 ${node}，展开其邻居`,
        en: `Dequeue & visit ${node}, expand neighbors`,
      });
    },
    onExamine: (from, to) => {
      examEdge = { from, to };
      render({
        zh: `检查边 ${from}→${to}${visited.has(to) ? '（已被访问）' : '（未访问）'}`,
        en: `Examine ${from}→${to}${visited.has(to) ? ' (visited)' : ' (unvisited)'}`,
      });
      examEdge = null;
    },
  };

  bfs(input, start, hooks);

  // 终态
  visiting = null;
  queue.length = 0;
  rec
    .begin({ zh: '搜索完成', en: 'BFS complete' })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: 'final' as BarRole,
      })),
      input.edges.map((e) => ({
        from: e.from,
        to: e.to,
        weight: e.weight,
        directed,
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
