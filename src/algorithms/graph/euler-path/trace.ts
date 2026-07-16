// =============================================================================
// 欧拉路径 · 录制帧序列
// setGraph 展示图：已走过的边标 'final'，当前推进的边标 'compare'。
// setAux 展示当前栈内容与已形成的路径序列。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eulerPath, type EulerGraphInput, type EulerHooks } from './impl.ts';

/** 演示用无向图：含欧拉回路。两个三角形共享一边。 */
export const DEFAULT_INPUT: EulerGraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'A' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
    { from: 'E', to: 'C' },
  ],
};

/** 环形布局归一化坐标。 */
const POS: Record<string, { x: number; y: number }> = (() => {
  const ring = DEFAULT_INPUT.nodes;
  const cx = 0.5;
  const cy = 0.5;
  const r = 0.34;
  const pos: Record<string, { x: number; y: number }> = {};
  ring.forEach((id, i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / ring.length;
    pos[id] = { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) };
  });
  return pos;
})();

const edgeKey = (a: string, b: string): string => (a < b ? `${a}>${b}` : `${b}>${a}`);

/** 录制演示帧序列。 */
export function buildTrace(input: EulerGraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const usedEdges = new Set<string>(); // "a>b" 无向键
  let curEdge: { from: string; to: string } | null = null;
  const stack: string[] = [];
  const path: string[] = [];

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (stack.includes(id)) role = 'frontier';
      if (id === stack[stack.length - 1]) role = 'pivot';
      if (path.includes(id) && !stack.includes(id)) role = 'final';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (usedEdges.has(edgeKey(e.from, e.to))) role = 'final';
      if (curEdge && edgeKey(curEdge.from, curEdge.to) === edgeKey(e.from, e.to)) role = 'compare';
      return { from: e.from, to: e.to, weight: undefined, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '栈 / stack', value: stack.length ? stack.join(' → ') : '∅', role: 'frontier' },
        { label: '路径 / path', value: path.length ? path.join(' → ') : '∅', role: 'final' },
      ])
      .commit();
  };

  render({
    zh: `无向图：${nodeIds.length} 节点 ${input.edges.length} 边`,
    en: `Undirected graph: ${nodeIds.length} nodes, ${input.edges.length} edges`,
  });

  const hooks: EulerHooks = {
    onEnter: (node) => {
      stack.push(node);
      render({ zh: `入栈 ${node}`, en: `Push ${node}` });
    },
    onTraverse: (u, v) => {
      curEdge = { from: u, to: v };
      usedEdges.add(edgeKey(u, v));
      render({ zh: `沿边 ${u}→${v} 推进（标记已用）`, en: `Traverse edge ${u}→${v} (mark used)` });
      curEdge = null;
    },
    onBacktrack: (node, _pathLen) => {
      // 出栈并加入路径头
      const idx = stack.lastIndexOf(node);
      if (idx >= 0) stack.splice(idx, 1);
      path.unshift(node);
      render({
        zh: `${node} 无可用边，回溯 → 加入路径`,
        en: `${node} has no edge left, backtrack → append to path`,
      });
    },
    onDone: (_p, isCircuit) => {
      render({
        zh: isCircuit ? `形成欧拉回路` : `形成欧拉路径`,
        en: isCircuit ? `Euler circuit formed` : `Euler path formed`,
      });
    },
  };

  const result = eulerPath(input, hooks);

  // 终态
  curEdge = null;
  rec
    .begin({
      zh: result.path
        ? `${result.isCircuit ? '欧拉回路' : '欧拉路径'}：${result.path.join(' → ')}`
        : '不存在欧拉路径',
      en: result.path
        ? `${result.isCircuit ? 'Euler circuit' : 'Euler path'}: ${result.path.join(' → ')}`
        : 'No Euler path exists',
    })
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
        role: (usedEdges.has(edgeKey(e.from, e.to)) ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([
      {
        label: '结果 / result',
        value: result.path ? result.path.join(' → ') : '无 / none',
        role: 'final',
      },
      {
        label: '类型 / type',
        value: result.path ? (result.isCircuit ? '回路 / circuit' : '路径 / path') : '—',
        role: 'frontier',
      },
    ])
    .commit();

  return rec.build();
}
