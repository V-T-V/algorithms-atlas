// =============================================================================
// 二分图最小点覆盖 · 录制帧序列
// 可视化：setGraph（二分图），role:匹配边='final'，覆盖点='pivot'，左部='frontier'，
// 右部='default'。setAux 展示匹配数与覆盖数。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bistar, type BipartiteInput, type BistarHooks } from './impl.ts';

/** 演示二分图：
 *   L1-R1, L1-R2, L2-R1, L3-R3, L4-R3, L4-R4
 *   最大匹配 = 4 → 最小覆盖 = 4。 */
export const DEFAULT_INPUT: BipartiteInput = {
  left: ['L1', 'L2', 'L3', 'L4'],
  right: ['R1', 'R2', 'R3', 'R4'],
  edges: [
    { from: 'L1', to: 'R1' },
    { from: 'L1', to: 'R2' },
    { from: 'L2', to: 'R1' },
    { from: 'L3', to: 'R3' },
    { from: 'L4', to: 'R3' },
    { from: 'L4', to: 'R4' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  L1: { x: 0.25, y: 0.15 },
  L2: { x: 0.25, y: 0.38 },
  L3: { x: 0.25, y: 0.62 },
  L4: { x: 0.25, y: 0.85 },
  R1: { x: 0.75, y: 0.15 },
  R2: { x: 0.75, y: 0.38 },
  R3: { x: 0.75, y: 0.62 },
  R4: { x: 0.75, y: 0.85 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: BipartiteInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const leftIds = input.left;
  const rightIds = input.right;
  const matchedEdges = new Set<string>();
  const coverLeft = new Set<string>();
  const coverRight = new Set<string>();
  let matchCount = 0;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [...leftIds, ...rightIds].map((id) => {
      let role: BarRole = 'default';
      if (leftIds.includes(id)) role = 'frontier';
      if (coverLeft.has(id) || coverRight.has(id)) role = 'pivot';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      const k = `${e.from}>${e.to}`;
      return {
        from: e.from,
        to: e.to,
        directed: false,
        role: (matchedEdges.has(k) ? 'final' : 'default') as BarRole,
      };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '匹配数', value: String(matchCount), role: 'final' },
        { label: '覆盖数', value: String(coverLeft.size + coverRight.size), role: 'pivot' },
      ])
      .commit();
  };

  render({ zh: '初始二分图', en: 'Initial bipartite graph' });

  const hooks: BistarHooks = {
    onMatch: (u, v) => {
      matchedEdges.add(`${u}>${v}`);
      matchCount++;
      render({ zh: `匹配 ${u}—${v}`, en: `Match ${u}-${v}` });
    },
    onAlternating: () => {
      render({ zh: '从未匹配左部点走交替路', en: 'Alternate from unmatched left nodes' });
    },
    onCover: (cl, cr) => {
      coverLeft.clear();
      coverRight.clear();
      cl.forEach((c) => coverLeft.add(c));
      cr.forEach((c) => coverRight.add(c));
      render({
        zh: `最小覆盖：左{${cl.join(',')}} + 右{${cr.join(',')}}`,
        en: `Min cover: L{${cl.join(',')}} + R{${cr.join(',')}}`,
      });
    },
  };

  const result = bistar(input, hooks);
  void result;

  return rec.build();
}
