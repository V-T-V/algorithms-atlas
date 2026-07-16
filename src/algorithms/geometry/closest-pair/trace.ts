// =============================================================================
// 最近点对 · 录制帧序列
// 用 setGraph 展示点集（x/y 归一化到 0~1），
// role：当前考察对='compare'，当前最近对='final'，带内点='frontier'；
// setAux 展示当前最小距离与考察信息。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { closestPair, type ClosestPairHooks, type Point } from './impl.ts';

export const DEFAULT_INPUT: Point[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 3, y: 1 },
  { x: 2, y: 3 },
  { x: 5, y: 3 },
  { x: 0, y: 4 },
  { x: 4, y: 4 },
];

/** 把原始点集归一化到 [0,1]×[0,1]（翻转 y 使屏幕上“上”为大 y）。 */
function normalizer(pts: readonly Point[]): (p: Point) => { x: number; y: number } {
  if (pts.length === 0) return () => ({ x: 0, y: 0 });
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const pad = 0.1;
  return (p) => ({
    x: pad + (0.5 - pad) * 2 * ((p.x - minX) / spanX),
    y: pad + (0.5 - pad) * 2 * (1 - (p.y - minY) / spanY),
  });
}

/** 录制演示帧序列。 */
export function buildTrace(input: Point[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const norm = normalizer(input);
  const idOf = (i: number): string => `p${i}`;

  let comparing: [number, number] | null = null;
  let bestPair: [number, number] | null = null;
  let bestDist = Infinity;
  let stripSet: Set<number> = new Set();
  let divideRange: [number, number] | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = input.map((p, i) => {
      const np = norm(p);
      let role: BarRole = 'default';
      if (bestPair && (i === bestPair[0] || i === bestPair[1])) role = 'final';
      if (stripSet.has(i) && role === 'default') role = 'frontier';
      if (comparing && (i === comparing[0] || i === comparing[1])) role = 'compare';
      return { id: idOf(i), label: `${i}`, x: np.x, y: np.y, role };
    });
    const edges: GraphEdge[] = [];
    if (comparing) {
      edges.push({ from: idOf(comparing[0]), to: idOf(comparing[1]), role: 'compare' });
    }
    if (bestPair && !comparing) {
      edges.push({ from: idOf(bestPair[0]), to: idOf(bestPair[1]), role: 'final' });
    }
    const aux = [
      {
        label: '当前最小距离',
        value: bestDist === Infinity ? '∞' : bestDist.toFixed(4),
        role: 'pivot' as BarRole,
      },
      {
        label: '当前最近对',
        value: bestPair ? `#${bestPair[0]} ↔ #${bestPair[1]}` : '无',
        role: 'final' as BarRole,
      },
      {
        label: '考察中',
        value: comparing
          ? `#${comparing[0]} ↔ #${comparing[1]}`
          : divideRange
            ? `划分 [${divideRange[0]},${divideRange[1]})`
            : '—',
        role: 'compare' as BarRole,
      },
    ];
    rec.begin(note).setGraph(nodes, edges).setAux(aux).commit();
    comparing = null;
    stripSet = new Set();
    divideRange = null;
  };

  render({ zh: `${n} 个点，求最近点对`, en: `${n} points, find closest pair` });

  const hooks: ClosestPairHooks = {
    onDivide: (lo, hi) => {
      divideRange = [lo, hi];
      render({ zh: `划分子问题 [${lo}, ${hi})`, en: `Divide subproblem [${lo}, ${hi})` });
    },
    onMerge: (mid, delta) => {
      // 高亮带内点（这里用 mid 附近点近似）
      stripSet = new Set([mid, mid + 1].filter((i) => i < n));
      render({
        zh: `合并：处理跨越中线（mid=${mid}）的点带，半宽 δ=${delta === Infinity ? '∞' : delta.toFixed(4)}`,
        en: `Merge: cross-mid strip (mid=${mid}), half-width δ=${delta === Infinity ? 'inf' : delta.toFixed(4)}`,
      });
    },
    onCompare: (i, j) => {
      comparing = [i, j];
      render({ zh: `比较 #${i} 与 #${j}`, en: `Compare #${i} and #${j}` });
    },
    onUpdate: (i, j, d) => {
      bestPair = [i, j];
      bestDist = d;
      render({
        zh: `更新最近对：#${i} ↔ #${j}，距离 ${d.toFixed(4)}`,
        en: `Update closest pair: #${i} ↔ #${j}, dist ${d.toFixed(4)}`,
      });
    },
  };

  const result = closestPair(input, hooks);
  bestPair = [
    input.findIndex((p) => p.x === result.pair[0].x && p.y === result.pair[0].y),
    input.findIndex((p) => p.x === result.pair[1].x && p.y === result.pair[1].y),
  ];

  // 终态：只画最近对
  const bp: [number, number] = bestPair ?? [0, 0];
  const nodes: GraphNode[] = input.map((p, i) => {
    const np = norm(p);
    return {
      id: idOf(i),
      label: `${i}`,
      x: np.x,
      y: np.y,
      role: bp.includes(i) ? 'final' : 'default',
    };
  });
  rec
    .begin({
      zh: `最近点对：#${bp[0]} ↔ #${bp[1]}，距离 ${result.distance.toFixed(4)}`,
      en: `Closest pair: #${bp[0]} ↔ #${bp[1]}, dist ${result.distance.toFixed(4)}`,
    })
    .setGraph(nodes, [{ from: idOf(bp[0]!), to: idOf(bp[1]!), role: 'final' }])
    .commit();

  return rec.build();
}
