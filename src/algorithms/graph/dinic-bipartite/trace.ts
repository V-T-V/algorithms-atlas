// =============================================================================
// 二分图最大匹配（Dinic）· 录制帧序列
// 可视化：setGraph（二分图 + 虚拟源汇），role:已匹配边='final'，当前轮新匹配='compare'，
// 源='frontier'，汇='pivot'。setAux 展示匹配数与轮次。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dinicBipartite, type BipartiteInput, type DinicBipartiteHooks } from './impl.ts';

/** 演示二分图：左 L1..L4，右 R1..R4。
 *   L1-R1, L1-R2, L2-R1, L3-R3, L4-R3, L4-R4
 *   最大匹配 = 4。 */
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
  SRC: { x: 0.05, y: 0.5 },
  L1: { x: 0.3, y: 0.15 },
  L2: { x: 0.3, y: 0.38 },
  L3: { x: 0.3, y: 0.62 },
  L4: { x: 0.3, y: 0.85 },
  R1: { x: 0.6, y: 0.15 },
  R2: { x: 0.6, y: 0.38 },
  R3: { x: 0.6, y: 0.62 },
  R4: { x: 0.6, y: 0.85 },
  SINK: { x: 0.9, y: 0.5 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: BipartiteInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const matchedEdges = new Set<string>(); // "L>R"
  let phase = 0;
  let matchCount = 0;

  const render = (note: { zh: string; en: string }): void => {
    const leftIds = input.left;
    const rightIds = input.right;
    const allIds = ['SRC', ...leftIds, ...rightIds, 'SINK'];
    const nodes: GraphNode[] = allIds.map((id) => {
      let role: BarRole = 'default';
      if (id === 'SRC') role = 'frontier';
      else if (id === 'SINK') role = 'pivot';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = [];
    // SRC → left
    for (const l of leftIds) edges.push({ from: 'SRC', to: l, directed: true, role: 'default' });
    // 原边
    for (const e of input.edges) {
      const k = `${e.from}>${e.to}`;
      edges.push({
        from: e.from,
        to: e.to,
        directed: true,
        role: (matchedEdges.has(k) ? 'final' : 'default') as BarRole,
      });
    }
    // right → SINK
    for (const r of rightIds) edges.push({ from: r, to: 'SINK', directed: true, role: 'default' });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '轮次 / phase', value: String(phase), role: 'frontier' },
        { label: '匹配数 / match', value: String(matchCount), role: 'final' },
      ])
      .commit();
  };

  render({ zh: '初始二分图（转网络流）', en: 'Initial bipartite graph (as flow network)' });

  const phaseAug: number[] = [];
  const hooks: DinicBipartiteHooks = {
    onPhase: (p, aug) => {
      phase = p;
      phaseAug.push(aug);
      render({ zh: `第 ${p} 轮分层增广：新增 ${aug} 个匹配`, en: `Phase ${p}: +${aug} matches` });
    },
    onMatch: (pair) => {
      matchedEdges.add(`${pair[0]}>${pair[1]}`);
    },
    onDone: (mc) => {
      matchCount = mc;
      render({ zh: `完成，最大匹配 = ${mc}`, en: `Done, max matching = ${mc}` });
    },
  };

  const result = dinicBipartite(input, hooks);
  // 确保匹配边全部标记
  for (const [l, r] of result.matches) matchedEdges.add(`${l}>${r}`);

  render({ zh: `最大匹配 = ${result.matchCount}`, en: `Max matching = ${result.matchCount}` });

  return rec.build();
}
