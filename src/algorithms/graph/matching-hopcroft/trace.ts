// =============================================================================
// Hopcroft-Karp 二分图最大匹配 · 录制帧序列
// 可视化：setGraph（二分图，左部点居左、右部点居右），role: 匹配边='final'，当前增广='compare'，分层活跃='frontier'；
// setAux 展示分层 dist 与当前匹配数。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { matchingHopcroft, type BipartiteInput, type HopcroftKarpHooks } from './impl.ts';

/** 演示：左 L0..L3，右 R0..R3，最大匹配 = 4（完美匹配）。 */
export const DEFAULT_INPUT: BipartiteInput = {
  left: ['L0', 'L1', 'L2', 'L3'],
  right: ['R0', 'R1', 'R2', 'R3'],
  edges: [
    { left: 'L0', right: 'R0' },
    { left: 'L0', right: 'R1' },
    { left: 'L1', right: 'R0' },
    { left: 'L1', right: 'R2' },
    { left: 'L2', right: 'R1' },
    { left: 'L2', right: 'R3' },
    { left: 'L3', right: 'R2' },
    { left: 'L3', right: 'R3' },
  ],
};

/** 布局：左部点居左列，右部点居右列。 */
const layout = (input: BipartiteInput): Record<string, { x: number; y: number }> => {
  const pos: Record<string, { x: number; y: number }> = {};
  const ln = Math.max(1, input.left.length);
  input.left.forEach((u, i) => {
    pos[u] = { x: 0.2, y: 0.15 + (i / ln) * 0.7 };
  });
  const rn = Math.max(1, input.right.length);
  input.right.forEach((v, i) => {
    pos[v] = { x: 0.8, y: 0.15 + (i / rn) * 0.7 };
  });
  return pos;
};

/** 录制演示帧序列。 */
export function buildTrace(input: BipartiteInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const pos = layout(input);
  const matchLeft = new Map<string, string>();
  const dist = new Map<string, number>();
  let size = 0;
  let augmenting: Set<string> = new Set();

  const fmtDist = (): string =>
    input.left
      .map(
        (u) =>
          `${u}:${(() => {
            const d = dist.get(u);
            return d === undefined ? '·' : d === Infinity ? '∞' : String(d);
          })()}`,
      )
      .join('  ');

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [...input.left, ...input.right].map((id) => {
      let role: BarRole = 'default';
      if (matchLeft.has(id))
        role = 'final'; // 已匹配左点
      else {
        for (const v of matchLeft.values()) if (v === id) role = 'final';
      }
      if (augmenting.has(id)) role = 'compare';
      return { id, label: id, x: pos[id]?.x ?? 0.5, y: pos[id]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (matchLeft.get(e.left) === e.right) role = 'final';
      else if (augmenting.has(e.left) && augmenting.has(e.right)) role = 'compare';
      return { from: e.left, to: e.right, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '分层 dist / layer', value: fmtDist(), role: 'frontier' },
        { label: '匹配数 / matches', value: String(size), role: 'final' },
      ])
      .commit();
  };

  render({ zh: '初始二分图', en: 'Initial bipartite graph' });

  const hooks: HopcroftKarpHooks = {
    onPhase: (p) => {
      augmenting = new Set();
      render({ zh: `第 ${p} 阶段：BFS 分层`, en: `Phase ${p}: BFS layering` });
    },
    onLayer: (d) => {
      for (const [k, v] of d) dist.set(k, v);
      render({ zh: `分层完成（dist 见下）`, en: `Layering done (see dist)` });
    },
    onAugment: (u, path) => {
      augmenting = new Set([u, ...path]);
      render({
        zh: `找到增广路：${u} → ${path.join(' → ')}`,
        en: `Augmenting path: ${u} → ${path.join(' → ')}`,
      });
      augmenting = new Set();
    },
    onMatch: (u, v) => {
      matchLeft.set(u, v);
    },
    onPhaseDone: () => {},
    onDone: (s) => {
      size = s;
    },
  };

  const result = matchingHopcroft(input, hooks);

  // 终态
  augmenting = new Set();
  rec
    .begin({
      zh: `完成：最大匹配 ${result.size} 对`,
      en: `Done: maximum matching = ${result.size} pair(s)`,
    })
    .setGraph(
      [...input.left, ...input.right].map((id) => ({
        id,
        label: id,
        x: pos[id]?.x ?? 0.5,
        y: pos[id]?.y ?? 0.5,
        role: (matchLeft.has(id) || [...matchLeft.values()].includes(id)
          ? 'final'
          : 'default') as BarRole,
      })),
      input.edges.map((e) => ({
        from: e.left,
        to: e.right,
        role: (matchLeft.get(e.left) === e.right ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([{ label: '最大匹配 / max matching', value: String(result.size), role: 'final' }])
    .commit();

  return rec.build();
}
