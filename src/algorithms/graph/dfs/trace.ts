// =============================================================================
// 深度优先搜索 · 录制帧序列
// 通过 dfs 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dfs, type DfsHooks, type GraphInput } from './impl.ts';

/** 演示用无向图：与 BFS 同图，便于对比「一条路走到底」的差异。 */
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

export const DEFAULT_START = '1';

/** 归一化坐标：1 居中，其余顺时针环形。 */
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

  const visited = new Set<string>(); // 已发现
  const finished = new Set<string>(); // 已回溯离开
  const stack: string[] = []; // 当前递归栈（路径）
  const treeEdges = new Set<string>();
  let examEdge: { from: string; to: string } | null = null;

  const edgeKey = (a: string, b: string): string =>
    directed ? `${a}>${b}` : a < b ? `${a}-${b}` : `${b}-${a}`;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (finished.has(id)) role = 'frontier';
      if (visited.has(id)) role = 'compare';
      if (stack[stack.length - 1] === id) role = 'pivot';
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
      .setAux([{ label: 'Stack', value: stack.length ? stack.join(' → ') : '∅', role: 'pivot' }])
      .commit();
  };

  render({
    zh: `图共 ${nodeIds.length} 个节点，从 ${start} 开始深度优先搜索`,
    en: `${nodeIds.length} nodes; DFS from ${start}`,
  });

  const hooks: DfsHooks = {
    onDiscover: (node, parent) => {
      visited.add(node);
      stack.push(node);
      if (parent) treeEdges.add(edgeKey(parent, node));
      render({
        zh: `进入 ${node}${parent ? `（来自 ${parent}）` : '（起点）'}`,
        en: `Enter ${node}${parent ? ` (from ${parent})` : ' (start)'}`,
      });
    },
    onExamine: (from, to) => {
      examEdge = { from, to };
      render({
        zh: `检查边 ${from}→${to}${visited.has(to) ? '（已访问）' : '（未访问）'}`,
        en: `Examine ${from}→${to}${visited.has(to) ? ' (visited)' : ' (unvisited)'}`,
      });
      examEdge = null;
    },
    onLeave: (node) => {
      finished.add(node);
      // 弹栈
      const idx = stack.lastIndexOf(node);
      if (idx >= 0) stack.splice(idx, 1);
      render({ zh: `${node} 的子树处理完，回溯`, en: `${node} fully explored, backtrack` });
    },
  };

  dfs(input, start, hooks);

  stack.length = 0;
  rec
    .begin({ zh: '搜索完成', en: 'DFS complete' })
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
