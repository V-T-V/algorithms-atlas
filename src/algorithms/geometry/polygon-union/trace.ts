// =============================================================================
// 多边形并集面积 · 录制帧序列
// 用 setGraph 展示多边形轮廓（pivot）与采样点（命中=final，未中=warn），
// setAux 展示估计面积与命中比例。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  polygonUnionArea,
  unionBoundingBox,
  mulberry32,
  type Point,
  type PolygonUnionHooks,
} from './impl.ts';

export const DEFAULT_INPUT = {
  // 两个重叠的矩形
  polygons: [
    [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
      { x: 0, y: 4 },
    ],
    [
      { x: 2, y: 1 },
      { x: 6, y: 1 },
      { x: 6, y: 5 },
      { x: 2, y: 5 },
    ],
  ] as Point[][],
  n: 600,
  seed: 42,
};

interface BuildTraceInput {
  polygons?: Point[][];
  n?: number;
  seed?: number;
}

export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const polygons = input.polygons ?? DEFAULT_INPUT.polygons;
  const n = input.n ?? DEFAULT_INPUT.n;
  const seed = input.seed ?? DEFAULT_INPUT.seed;

  const rec = new TraceRecorder();
  const bb = unionBoundingBox(polygons)!;
  const sampleNodes: GraphNode[] = [];
  let lastEstimate = 0;
  let lastHit = 0;

  const norm = (x: number, y: number) => ({
    x: (x - bb.xmin) / (bb.xmax - bb.xmin),
    y: 1 - (y - bb.ymin) / (bb.ymax - bb.ymin),
  });

  // 多边形轮廓：每个顶点给一个全局唯一 id
  const polyEdges: GraphEdge[] = [];
  const polyNodes: GraphNode[] = [];
  let pid = 0;
  for (const poly of polygons) {
    for (let i = 0; i < poly.length; i++) {
      const np = norm(poly[i]!.x, poly[i]!.y);
      polyNodes.push({ id: `pv${pid}`, x: np.x, y: np.y, role: 'pivot' as BarRole });
      pid++;
    }
  }
  // 用每个多边形首尾相连的边
  let cursor = 0;
  for (const poly of polygons) {
    for (let i = 0; i < poly.length; i++) {
      const j = (i + 1) % poly.length;
      polyEdges.push({ from: `pv${cursor + i}`, to: `pv${cursor + j}`, role: 'pivot' as BarRole });
    }
    cursor += poly.length;
  }

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph([...polyNodes, ...sampleNodes.slice(-Math.min(sampleNodes.length, 200))], polyEdges)
      .setAux([
        { label: '并集面积估计', value: lastEstimate.toFixed(3), role: 'final' as BarRole },
        {
          label: '命中比例',
          value: n > 0 ? (lastHit / n).toFixed(3) : '0',
          role: 'compare' as BarRole,
        },
        {
          label: '包围盒面积',
          value: ((bb.xmax - bb.xmin) * (bb.ymax - bb.ymin)).toFixed(3),
          role: 'default' as BarRole,
        },
        { label: '采样数', value: String(sampleNodes.length), role: 'pivot' as BarRole },
      ])
      .commit();
  };

  render({
    zh: `多边形并集面积估计：${polygons.length} 个多边形，投 ${n} 点`,
    en: `Polygon union area estimate: ${polygons.length} polygons, ${n} samples`,
  });

  const hooks: PolygonUnionHooks = {
    onSample: (p, hit) => {
      const np = norm(p.x, p.y);
      sampleNodes.push({
        id: `s${sampleNodes.length}`,
        x: np.x,
        y: np.y,
        role: (hit ? 'final' : 'warn') as BarRole,
      });
    },
    onBatch: (estimate, total) => {
      lastEstimate = estimate;
      lastHit =
        total > 0
          ? Math.round((estimate / ((bb.xmax - bb.xmin) * (bb.ymax - bb.ymin))) * total)
          : 0;
      render({
        zh: `已投 ${total} 点，估计 ≈ ${estimate.toFixed(3)}`,
        en: `${total} samples, estimate ≈ ${estimate.toFixed(3)}`,
      });
    },
  };

  const result = polygonUnionArea(
    polygons,
    n,
    mulberry32(seed),
    Math.max(1, Math.floor(n / 6)),
    hooks,
  );

  // 终态
  rec
    .begin({
      zh: `完成：${result.totalCount} 点，命中 ${result.hitCount}，并集面积 ≈ ${result.estimate.toFixed(3)}`,
      en: `Done: ${result.totalCount} samples, ${result.hitCount} hits, union area ≈ ${result.estimate.toFixed(3)}`,
    })
    .setGraph([...polyNodes, ...sampleNodes.slice(-Math.min(sampleNodes.length, 300))], polyEdges)
    .setAux([
      { label: '并集面积估计', value: result.estimate.toFixed(3), role: 'final' },
      {
        label: '命中比例',
        value: (result.hitCount / result.totalCount).toFixed(3),
        role: 'compare',
      },
      { label: '包围盒面积', value: result.boxArea.toFixed(3), role: 'default' },
      { label: '命中点数', value: String(result.hitCount), role: 'pivot' },
    ])
    .commit();

  return rec.build();
}
