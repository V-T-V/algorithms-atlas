// 多边形重心 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { polygonCentroid, type Point, type PolygonCentroidHooks } from './impl.ts';

export interface CentroidInput {
  poly: Point[];
}

export const DEFAULT_INPUT: CentroidInput = {
  poly: [
    { x: 0, y: 0 },
    { x: 8, y: 0 },
    { x: 8, y: 6 },
    { x: 0, y: 6 },
  ],
};

const graphFrom = (poly: Point[], centroid?: Point) => ({
  nodes: [
    ...poly.map((p, i) => ({
      id: String(i),
      label: `(${p.x},${p.y})`,
      x: (p.x % 12) / 12,
      y: 1 - (p.y % 12) / 12,
      role: 'final' as BarRole,
    })),
    ...(centroid
      ? [
          {
            id: 'C',
            label: 'C',
            x: (centroid.x % 12) / 12,
            y: 1 - (centroid.y % 12) / 12,
            role: 'pivot' as BarRole,
          },
        ]
      : []),
  ],
  edges: poly.map((_, i) => ({ from: String(i), to: String((i + 1) % poly.length) })),
});

/** 录制演示帧序列。 */
export function buildTrace(input: CentroidInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { poly } = input;

  rec
    .begin({ zh: `多边形（${poly.length} 个顶点）`, en: `Polygon (${poly.length} vertices)` })
    .setGraph(graphFrom(poly).nodes, graphFrom(poly).edges)
    .commit();

  const hooks: PolygonCentroidHooks = {
    onEdge: (i) => {
      rec
        .begin({ zh: `累计第 ${i} 条边`, en: `Accumulate edge ${i}` })
        .setGraph(graphFrom(poly).nodes, graphFrom(poly).edges)
        .commit();
    },
  };
  const { centroid, signedArea } = polygonCentroid(poly, hooks);

  rec
    .begin({
      zh: `重心 = (${centroid.x.toFixed(2)}, ${centroid.y.toFixed(2)})`,
      en: `Centroid = (${centroid.x.toFixed(2)}, ${centroid.y.toFixed(2)})`,
    })
    .setGraph(graphFrom(poly, centroid).nodes, graphFrom(poly, centroid).edges)
    .setMap([
      {
        key: '重心',
        value: `(${centroid.x.toFixed(2)}, ${centroid.y.toFixed(2)})`,
        role: 'final' as BarRole,
      },
      { key: '面积', value: Math.abs(signedArea).toFixed(2), role: 'default' as BarRole },
    ])
    .commit();

  return rec.build();
}
