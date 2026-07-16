// =============================================================================
// 匈牙利算法 · 录制帧序列
// 用 setGraph 展示二分图：匹配边标 'final'，正在搜索的交替路边标 'compare'。
// 匹配进度用 setAux 展示。左部在左、右部在右双列布局。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hungarian, type BipartiteGraphInput, type HungarianHooks } from './impl.ts';

/** 演示用二分图：4 左 4 右，最大匹配 = 4（完美匹配）。 */
export const DEFAULT_INPUT: BipartiteGraphInput = {
  left: ['L1', 'L2', 'L3', 'L4'],
  right: ['R1', 'R2', 'R3', 'R4'],
  edges: [
    { from: 'L1', to: 'R1' },
    { from: 'L1', to: 'R2' },
    { from: 'L2', to: 'R1' },
    { from: 'L2', to: 'R3' },
    { from: 'L3', to: 'R2' },
    { from: 'L3', to: 'R4' },
    { from: 'L4', to: 'R3' },
    { from: 'L4', to: 'R4' },
  ],
};

/** 左右双列归一化坐标。 */
const colPos = (ids: readonly string[], x: number): Record<string, { x: number; y: number }> => {
  const pos: Record<string, { x: number; y: number }> = {};
  const n = ids.length;
  ids.forEach((id, i) => {
    pos[id] = { x, y: n === 1 ? 0.5 : 0.15 + (i * 0.7) / (n - 1) };
  });
  return pos;
};

/** 录制演示帧序列。 */
export function buildTrace(input: BipartiteGraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const leftPos = colPos(input.left, 0.22);
  const rightPos = colPos(input.right, 0.78);

  // 当前匹配：right → left
  const rightToLeft = new Map<string, string | null>();
  for (const r of input.right) rightToLeft.set(r, null);
  const leftToRight = new Map<string, string | null>();
  for (const l of input.left) leftToRight.set(l, null);
  let matchCount = 0;
  let trying: string | null = null;
  let visiting: { from: string; to: string } | null = null;
  // 本轮增广搜索访问过的右点
  let visitedRight = new Set<string>();

  const posOf = (id: string): { x: number; y: number } =>
    leftPos[id] ?? rightPos[id] ?? { x: 0.5, y: 0.5 };

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [...input.left, ...input.right].map((id) => {
      const isLeft = input.left.includes(id);
      let role: BarRole = isLeft ? 'frontier' : 'default';
      if (id === trying) role = 'pivot';
      const matchedTo = isLeft ? leftToRight.get(id) : (rightToLeft.get(id) ?? null);
      const label = matchedTo ? `${id}↔${matchedTo}` : id;
      return { id, label, x: posOf(id).x, y: posOf(id).y, role };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (rightToLeft.get(e.to) === e.from) role = 'final';
      else if (rightToLeft.get(e.to)) role = 'warn'; // 别人的匹配边
      if (visiting && visiting.from === e.from && visiting.to === e.to) role = 'compare';
      return { from: e.from, to: e.to, directed: true, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '匹配数 / matching', value: String(matchCount), role: 'final' },
        { label: '当前左点 / current', value: trying ?? '—', role: 'pivot' },
        {
          label: '本轮已访 / visited',
          value: visitedRight.size ? [...visitedRight].sort().join(',') : '—',
          role: 'frontier',
        },
      ])
      .commit();
  };

  render({
    zh: `二分图：${input.left.length} 左 × ${input.right.length} 右`,
    en: `Bipartite: ${input.left.length} left × ${input.right.length} right`,
  });

  const hooks: HungarianHooks = {
    onTryMatch: (u) => {
      trying = u;
      visitedRight = new Set<string>();
      render({ zh: `尝试为 ${u} 找增广路`, en: `Try to find augmenting path for ${u}` });
    },
    onVisitEdge: (u, v, matched) => {
      visiting = { from: u, to: v };
      visitedRight.add(v);
      render({
        zh: `考察边 ${u}→${v}${matched ? `（${v} 已匹配于 ${rightToLeft.get(v)}）` : `（${v} 未匹配）`}`,
        en: `Examine ${u}→${v}${matched ? ` (${v} matched to ${rightToLeft.get(v)})` : ` (${v} free)`}`,
      });
      visiting = null;
    },
    onMatchEdge: (u, v, replaced) => {
      // 翻转：先把旧的（若有）左点解绑
      const oldLeft = rightToLeft.get(v);
      if (oldLeft) leftToRight.set(oldLeft, null);
      rightToLeft.set(v, u);
      leftToRight.set(u, v);
      matchCount = [...rightToLeft.values()].filter((x) => x !== null).length;
      visiting = { from: u, to: v };
      render({
        zh: `翻转匹配 ${u}↔${v}${replaced ? `（${oldLeft} 让出 ${v}）` : ''}，匹配数 = ${matchCount}`,
        en: `Flip match ${u}↔${v}${replaced ? ` (${oldLeft} releases ${v})` : ''}, count = ${matchCount}`,
      });
      visiting = null;
    },
    onTryResult: (u, found) => {
      render({
        zh: found ? `${u} 增广成功` : `${u} 无增广路，跳过`,
        en: found ? `${u} augmented` : `${u} no augmenting path, skip`,
      });
    },
    onDone: (mc) => {
      matchCount = mc;
    },
  };

  const result = hungarian(input, hooks);

  // 终态
  trying = null;
  visiting = null;
  rec
    .begin({
      zh: `最大匹配 = ${result.matchCount}`,
      en: `Maximum matching = ${result.matchCount}`,
    })
    .setGraph(
      [...input.left, ...input.right].map((id) => {
        const isLeft = input.left.includes(id);
        const matchedTo = isLeft ? leftToRight.get(id) : (rightToLeft.get(id) ?? null);
        return {
          id,
          label: matchedTo ? `${id}↔${matchedTo}` : id,
          x: posOf(id).x,
          y: posOf(id).y,
          role: 'final' as BarRole,
        };
      }),
      input.edges.map((e) => ({
        from: e.from,
        to: e.to,
        directed: true,
        role: (rightToLeft.get(e.to) === e.from ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([
      { label: '最大匹配 / max matching', value: String(result.matchCount), role: 'final' },
      {
        label: '匹配对 / pairs',
        value: result.pairs.map((p) => `${p.left}-${p.right}`).join(' '),
        role: 'frontier',
      },
    ])
    .commit();

  return rec.build();
}
