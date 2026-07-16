// =============================================================================
// 多边形偏移 · 录制帧序列
// =============================================================================

import type { Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { polygonOffset, type Point } from './impl.ts';

export const DEFAULT_INPUT = {
  polygon: [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 3 },
    { x: 0, y: 3 },
  ] as Point[],
  d: 0.5,
};

function normalizer(pts: readonly Point[]): (p: Point) => { x: number; y: number } {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const span = Math.max(spanX, spanY);
  const pad = 0.1;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return (p) => ({
    x: 0.5 + (0.5 - pad) * ((p.x - cx) / span) * 2,
    y: 0.5 + (0.5 - pad) * ((cy - p.y) / span) * 2,
  });
}

export function buildTrace(input: { polygon: Point[]; d: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { polygon, d } = input;
  const allPts = [...polygon];
  const norm = normalizer(allPts);

  const origNodes: GraphNode[] = polygon.map((p, i) => ({
    id: 'o' + i,
    label: String(i),
    x: norm(p).x,
    y: norm(p).y,
    role: 'pivot',
  }));
  const origEdges: GraphEdge[] = polygon.map((_, i) => ({
    from: 'o' + i,
    to: 'o' + ((i + 1) % polygon.length),
    role: 'compare',
  }));

  rec
    .begin({
      zh: `多边形 ${polygon.length} 边，偏移距离 d = ${d}`,
      en: `Polygon ${polygon.length} edges, offset d = ${d}`,
    })
    .setGraph(origNodes, origEdges)
    .setAux([
      { label: '原边数', value: String(polygon.length), role: 'pivot' },
      { label: 'd', value: String(d), role: 'frontier' },
    ])
    .commit();

  const result = polygonOffset(polygon, d, {
    onVertex: (idx, newV) => {
      rec
        .begin({
          zh: `顶点 ${idx} 偏移 → (${newV.x.toFixed(2)},${newV.y.toFixed(2)})`,
          en: `Vertex ${idx} offset → (${newV.x.toFixed(2)},${newV.y.toFixed(2)})`,
        })
        .setGraph(origNodes, origEdges)
        .setAux([
          { label: '处理顶点', value: String(idx), role: 'frontier' },
          {
            label: '新顶点',
            value: `(${newV.x.toFixed(2)},${newV.y.toFixed(2)})`,
            role: 'compare',
          },
        ])
        .commit();
    },
  });

  const offsetNodes: GraphNode[] = [
    ...origNodes,
    ...result.map((p, i) => ({
      id: 'n' + i,
      label: '',
      x: norm(p).x,
      y: norm(p).y,
      role: 'final' as const,
    })),
  ];
  const offsetEdges: GraphEdge[] = [
    ...origEdges,
    ...result.map((_, i) => ({
      from: 'n' + i,
      to: 'n' + ((i + 1) % result.length),
      role: 'final' as const,
    })),
  ];
  rec
    .begin({
      zh: `完成：偏移后多边形 ${result.length} 顶点`,
      en: `Done: offset polygon has ${result.length} vertices`,
    })
    .setGraph(offsetNodes, offsetEdges)
    .setAux([{ label: '新顶点数', value: String(result.length), role: 'final' }])
    .commit();

  return rec.build();
}
