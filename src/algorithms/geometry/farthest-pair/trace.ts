// =============================================================================
// 最远点对（旋转卡壳）· 录制帧序列
// 用 setGraph 展示点集、凸包边与当前对踵点对（高亮）。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { farthestPair, type Point, type FarthestPairHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  points: [
    { x: 1, y: 1 },
    { x: 5, y: 2 },
    { x: 9, y: 4 },
    { x: 3, y: 7 },
    { x: 7, y: 8 },
    { x: 2, y: 4 },
    { x: 6, y: 5 },
    { x: 8, y: 6 },
    { x: 4, y: 3 },
  ] as Point[],
};

interface BuildTraceInput {
  points?: Point[];
}

const BX = 10;
const BY = 10;

const norm = (x: number, y: number) => ({
  x: x / BX,
  y: 1 - y / BY,
});

export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const points = input.points ?? DEFAULT_INPUT.points;
  const rec = new TraceRecorder();

  const idOf = (p: Point): string => {
    const idx = points.findIndex((q) => q.x === p.x && q.y === p.y);
    return `p${idx >= 0 ? idx : 0}`;
  };

  const baseNodes: GraphNode[] = points.map((p, i) => {
    const np = norm(p.x, p.y);
    return { id: `p${i}`, label: String(i), x: np.x, y: np.y, role: 'default' as BarRole };
  });

  // 初始帧
  rec
    .begin({
      zh: `点集（${points.length} 个点），求最远点对`,
      en: `Point set (${points.length} points), find farthest pair`,
    })
    .setGraph(baseNodes, [])
    .setAux([{ label: '点数', value: String(points.length), role: 'pivot' as BarRole }])
    .commit();

  let hullArr: Point[] = [];
  let pairIdx: [number, number] = [-1, -1];

  const hooks: FarthestPairHooks = {
    onHull: (hull) => {
      hullArr = hull;
      const hullEdges: GraphEdge[] = hull.map((_, i) => ({
        from: idOf(hull[i]!),
        to: idOf(hull[(i + 1) % hull.length]!),
        role: 'frontier' as BarRole,
      }));
      rec
        .begin({
          zh: `建凸包（${hull.length} 个顶点）`,
          en: `Build convex hull (${hull.length} vertices)`,
        })
        .setGraph(baseNodes, hullEdges)
        .setAux([{ label: '凸包顶点', value: String(hull.length), role: 'frontier' as BarRole }])
        .commit();
    },
    onAntipodal: (i, j, d) => {
      // 限制帧数：仅展示前若干次
      if (i > 0 && i % 2 !== 0) return;
      const hi = points.findIndex((p) => p.x === hullArr[i]!.x && p.y === hullArr[i]!.y);
      const hj = points.findIndex((p) => p.x === hullArr[j]!.x && p.y === hullArr[j]!.y);
      const edges: GraphEdge[] = hullArr.map((_, k) => ({
        from: idOf(hullArr[k]!),
        to: idOf(hullArr[(k + 1) % hullArr.length]!),
        role: 'frontier' as BarRole,
      }));
      if (hi >= 0 && hj >= 0) {
        edges.push({ from: `p${hi}`, to: `p${hj}`, role: 'swap' as BarRole });
      }
      rec
        .begin({
          zh: `对踵点 i=${i}, j=${j}，距离 ${d.toFixed(3)}`,
          en: `Antipodal i=${i}, j=${j}, distance ${d.toFixed(3)}`,
        })
        .setGraph(baseNodes, edges)
        .setAux([{ label: '对踵距离', value: d.toFixed(3), role: 'compare' as BarRole }])
        .commit();
    },
    onImprove: (d, pair) => {
      pairIdx = [
        points.findIndex((p) => p.x === pair[0].x && p.y === pair[0].y),
        points.findIndex((p) => p.x === pair[1].x && p.y === pair[1].y),
      ];
    },
  };

  const result = farthestPair(points, hooks);

  // 终态
  const edges: GraphEdge[] = hullArr.map((_, k) => ({
    from: idOf(hullArr[k]!),
    to: idOf(hullArr[(k + 1) % hullArr.length]!),
    role: 'final' as BarRole,
  }));
  if (pairIdx[0] >= 0 && pairIdx[1] >= 0) {
    edges.push({ from: `p${pairIdx[0]}`, to: `p${pairIdx[1]}`, role: 'swap' as BarRole });
  }
  rec
    .begin({
      zh: `完成：直径 = ${result.diameter.toFixed(3)}（点 ${pairIdx[0]} 与 ${pairIdx[1]}）`,
      en: `Done: diameter = ${result.diameter.toFixed(3)} (points ${pairIdx[0]} & ${pairIdx[1]})`,
    })
    .setGraph(baseNodes, edges)
    .setAux([
      { label: '直径', value: result.diameter.toFixed(4), role: 'final' as BarRole },
      { label: '最远点对', value: pairIdx.join(', '), role: 'swap' as BarRole },
    ])
    .commit();

  return rec.build();
}
