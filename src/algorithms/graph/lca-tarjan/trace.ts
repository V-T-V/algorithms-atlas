// =============================================================================
// LCA Tarjan · 录制帧序列
// 可视化：setGraph（树），role:已访问='frontier'，当前='compare'，LCA='pivot'。
// setAux 展示询问与答案。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lcaTarjan, type GraphInput, type LcaQuery, type LcaTarjanHooks } from './impl.ts';

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

export const DEFAULT_QUERIES: LcaQuery[] = [
  { u: '3', v: '5' },
  { u: '3', v: '2' },
  { u: '4', v: '5' },
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
  queries: readonly LcaQuery[] = DEFAULT_QUERIES,
): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const visited = new Set<string>();
  const answers = new Map<number, string>();
  let cur: string | null = null;
  let highlight: { u: string; v: string; l: string } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (visited.has(id)) role = 'frontier';
      if (id === cur) role = 'compare';
      if (highlight && id === highlight.l) role = 'pivot';
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
      .setAux([
        {
          label: '询问',
          value: queries.map((q, i) => `${q.u}∩${q.v}=${answers.get(i) ?? '?'}`).join('  '),
          role: 'pivot',
        },
      ])
      .commit();
  };

  render({ zh: '初始树', en: 'Initial tree' });

  const hooks: LcaTarjanHooks = {
    onVisit: (u) => {
      cur = u;
      render({ zh: `访问 ${u}`, en: `Visit ${u}` });
    },
    onUnion: (par, child) => {
      cur = par;
      render({ zh: `合并 ${child} → ${par}`, en: `Union ${child} into ${par}` });
    },
    onAnswer: (u, v, l) => {
      // 找到对应询问下标
      const idx = queries.findIndex((q) => (q.u === u && q.v === v) || (q.u === v && q.v === u));
      if (idx >= 0) answers.set(idx, l);
      highlight = { u, v, l };
      cur = l;
      render({ zh: `LCA(${u},${v}) = ${l}`, en: `LCA(${u},${v}) = ${l}` });
      highlight = null;
    },
  };

  const result = lcaTarjan(input, queries, hooks);
  answers.clear();
  result.answers.forEach((a, i) => answers.set(i, a));

  cur = null;
  rec
    .begin({ zh: '全部询问已回答', en: 'All queries answered' })
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
      {
        label: '答案',
        value: result.answers.join(', '),
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
