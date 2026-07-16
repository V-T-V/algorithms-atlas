// 点在多边形内 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import type { BarRole, GraphNode } from '../../../types.ts';
import { pointInPolygon, type Pt } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  // 五角星样凹多边形
  const poly: Pt[] = [
    { x: 0, y: 2 },
    { x: 1, y: 1 },
    { x: 4, y: 1 },
    { x: 2, y: -1 },
    { x: 3, y: -4 },
    { x: 0, y: -2 },
    { x: -3, y: -4 },
    { x: -2, y: -1 },
    { x: -4, y: 1 },
    { x: -1, y: 1 },
  ];
  const p: Pt = { x: 0, y: 0 };

  const minX = -5;
  const maxX = 5;
  const minY = -5;
  const maxY = 3;
  const norm = (pt: Pt): { x: number; y: number } => {
    const pad = 0.1;
    const sx = maxX - minX;
    const sy = maxY - minY;
    return {
      x: pad + ((pt.x - minX) / sx) * (1 - 2 * pad),
      y: pad + (1 - (pt.y - minY) / sy) * (1 - 2 * pad),
    };
  };

  // 多边形边
  const polyEdges = poly.map((_, i) => ({
    from: `v${i}`,
    to: `v${(i + 1) % poly.length}`,
    role: 'default' as const,
  }));
  const polyNodes: GraphNode[] = poly.map((pt, i) => ({
    id: `v${i}`,
    label: `${i}`,
    ...norm(pt),
    role: 'default',
  }));
  const queryNode: GraphNode = { id: 'p', label: 'P', ...norm(p), role: 'compare' };

  rec
    .begin({ zh: `凹多边形与待测点 P`, en: `Concave polygon and query point P` })
    .setGraph([...polyNodes, queryNode], polyEdges)
    .commit();

  let total = 0;
  pointInPolygon(poly, p, {
    onEdge: (i, crosses) => {
      if (crosses) {
        total++;
        const edges = polyEdges.map((e) =>
          Number(e.from.slice(1)) === i ? { ...e, role: 'compare' as BarRole } : e,
        );
        rec
          .begin({
            zh: `边 ${i} 与射线相交（计数=${total}）`,
            en: `Edge ${i} crosses ray (count=${total})`,
          })
          .setGraph([...polyNodes, queryNode], edges)
          .commit();
      }
    },
  });

  const inside = total % 2 === 1;
  rec
    .begin({
      zh: `交点 ${total} 次 → ${inside ? '内部' : '外部'}`,
      en: `${total} crossings → ${inside ? 'inside' : 'outside'}`,
    })
    .setGraph([...polyNodes, queryNode], polyEdges)
    .setAux([
      { label: `交点数`, value: String(total) },
      { label: `结论`, value: inside ? 'inside' : 'outside' },
    ])
    .commit();

  return rec.build();
}
