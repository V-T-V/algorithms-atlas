// 凸包面积 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import type { BarRole, GraphNode } from '../../../types.ts';
import { convexHullArea, type Pt } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  const points: Pt[] = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 }, // 外框四角
    { x: 2, y: 2 },
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 2, y: 3 }, // 内部点
  ];

  const minX = -1;
  const maxX = 5;
  const minY = -1;
  const maxY = 5;
  const norm = (pt: Pt): { x: number; y: number } => {
    const pad = 0.1;
    const sx = maxX - minX || 1;
    const sy = maxY - minY || 1;
    return {
      x: pad + ((pt.x - minX) / sx) * (1 - 2 * pad),
      y: pad + (1 - (pt.y - minY) / sy) * (1 - 2 * pad),
    };
  };

  // 初始点集
  const nodes0: GraphNode[] = points.map((p, i) => ({
    id: `p${i}`,
    label: `${i}`,
    ...norm(p),
    role: 'default',
  }));
  rec
    .begin({ zh: `${points.length} 个点`, en: `${points.length} points` })
    .setGraph(nodes0, [])
    .commit();

  let hullPts: Pt[] = [];
  let area = 0;
  area = convexHullArea(points, {
    onHull: (h) => (hullPts = h),
    onArea: (a) => (area = a),
  });

  // 标记凸包顶点
  const onHull = new Set(hullPts.map((p) => `${p.x},${p.y}`));
  const nodes1: GraphNode[] = points.map((p, i) => ({
    id: `p${i}`,
    label: `${i}`,
    ...norm(p),
    role: (onHull.has(`${p.x},${p.y}`) ? 'final' : 'default') as BarRole,
  }));
  const hullEdges = hullPts.map((p, i) => ({
    from: `hp${i}`,
    to: `hp${(i + 1) % hullPts.length}`,
    role: 'final' as const,
  }));
  const hullNodes: GraphNode[] = hullPts.map((p, i) => ({
    id: `hp${i}`,
    label: ``,
    ...norm(p),
    role: 'final',
  }));
  rec
    .begin({
      zh: `凸包 ${hullPts.length} 顶点，面积 ≈ ${area.toFixed(4)}`,
      en: `Hull of ${hullPts.length} vertices, area ≈ ${area.toFixed(4)}`,
    })
    .setGraph([...nodes1, ...hullNodes], hullEdges)
    .setAux([
      { label: `凸包顶点数`, value: String(hullPts.length) },
      { label: `面积`, value: area.toFixed(6) },
    ])
    .commit();

  return rec.build();
}
