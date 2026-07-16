// =============================================================================
// RMQ-LCA · 录制帧序列
// 可视化：setGraph（树），role:欧拉游迹当前='compare'，已访问='frontier'，LCA='pivot'；
// setAux 展示欧拉序列与询问。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rmqLca, type GraphInput, type RmqLcaHooks } from './impl.ts';

/** 演示树（根 1）：
 *   1 - 2 - 3
 *   |
 *   4 - 5 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['1', '2', '3', '4', '5'],
  edges: [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '1', to: '4' },
    { from: '4', to: '5' },
  ],
  root: '1',
};

export const DEFAULT_QUERIES: Array<{ u: string; v: string }> = [
  { u: '3', v: '5' },
  { u: '3', v: '2' },
];

const POS: Record<string, { x: number; y: number }> = {
  '1': { x: 0.2, y: 0.5 },
  '2': { x: 0.5, y: 0.28 },
  '3': { x: 0.82, y: 0.28 },
  '4': { x: 0.5, y: 0.78 },
  '5': { x: 0.82, y: 0.78 },
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: GraphInput = DEFAULT_INPUT,
  queries: ReadonlyArray<{ u: string; v: string }> = DEFAULT_QUERIES,
): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const visited = new Set<string>();
  const euler: string[] = [];
  let cur: string | null = null;
  let highlight: string | null = null;
  const answers: string[] = [];

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (visited.has(id)) role = 'frontier';
      if (id === cur) role = 'compare';
      if (id === highlight) role = 'pivot';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = input.edges.map((e) => ({
      from: e.from,
      to: e.to,
      role: 'default',
    }));
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([{ label: '欧拉序列', value: euler.join(' → ') || '∅', role: 'frontier' }])
      .commit();
  };

  render({ zh: '初始树，开始欧拉游迹', en: 'Initial tree; start Euler tour' });

  const hooks: RmqLcaHooks = {
    onEuler: (u) => {
      euler.push(u);
      visited.add(u);
      cur = u;
      render({ zh: `欧拉访问 ${u}`, en: `Euler visit ${u}` });
    },
    onSparseBuilt: (lv) => {
      cur = null;
      render({ zh: `稀疏表构建完成（${lv} 层）`, en: `Sparse table built (${lv} levels)` });
    },
    onAnswer: (u, v, l) => {
      highlight = l;
      cur = l;
      answers.push(`${u}∩${v}=${l}`);
      render({ zh: `LCA(${u},${v}) = ${l}`, en: `LCA(${u},${v}) = ${l}` });
      highlight = null;
    },
  };

  const result = rmqLca(input, hooks);
  answers.length = 0;
  for (const q of queries) result.query(q.u, q.v);

  cur = null;
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: 'final' as BarRole,
      })),
      input.edges.map((e) => ({ from: e.from, to: e.to, role: 'default' as BarRole })),
    )
    .setAux([
      { label: '欧拉序列', value: result.euler.join(' → '), role: 'final' },
      { label: '答案', value: answers.join(', '), role: 'pivot' },
    ])
    .commit();

  return rec.build();
}
