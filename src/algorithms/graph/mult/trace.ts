// =============================================================================
// 倍增 LCA · 录制帧序列
// 可视化：setGraph（树），role:上跳路径='compare'，LCA='pivot'，已访问='frontier'。
// setAux 展示深度与询问。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mult, type GraphInput, type MultHooks } from './impl.ts';

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
  const depthMap = new Map<string, number>();
  const visited = new Set<string>();
  let liftNodes = new Set<string>();
  let highlight: string | null = null;
  const answers: string[] = [];

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (visited.has(id)) role = 'frontier';
      if (liftNodes.has(id)) role = 'compare';
      if (id === highlight) role = 'pivot';
      return {
        id,
        label: depthMap.has(id) ? `${id}\nd=${depthMap.get(id)}` : id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => ({
      from: e.from,
      to: e.to,
      role: 'default',
    }));
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([{ label: '答案', value: answers.join(', ') || '∅', role: 'pivot' }])
      .commit();
  };

  render({ zh: '初始树', en: 'Initial tree' });

  const hooks: MultHooks = {
    onVisit: (u, d) => {
      depthMap.set(u, d);
      visited.add(u);
      render({ zh: `BFS 访问 ${u}（深度 ${d}）`, en: `BFS visit ${u} (depth ${d})` });
    },
    onTableBuilt: (lv) => {
      render({ zh: `倍增表构建完成（${lv} 层）`, en: `Binary lifting table built (${lv} levels)` });
    },
    onLift: (u, k, anc) => {
      liftNodes = new Set([u, ...(anc ? [anc] : [])]);
      render({
        zh: `${u} 上跳 2^${k} → ${anc ?? '∅'}`,
        en: `Lift ${u} by 2^${k} -> ${anc ?? '∅'}`,
      });
    },
    onAnswer: (u, v, l) => {
      liftNodes = new Set();
      highlight = l;
      answers.push(`${u}∩${v}=${l}`);
      render({ zh: `LCA(${u},${v}) = ${l}`, en: `LCA(${u},${v}) = ${l}` });
      highlight = null;
    },
  };

  const result = mult(input, hooks);
  for (const q of queries) result.query(q.u, q.v);

  highlight = null;
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: `${id}\nd=${depthMap.get(id) ?? '?'}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: 'final' as BarRole,
      })),
      input.edges.map((e) => ({ from: e.from, to: e.to, role: 'default' as BarRole })),
    )
    .setAux([{ label: '倍增层数', value: String(result.levels), role: 'frontier' }])
    .commit();

  return rec.build();
}
