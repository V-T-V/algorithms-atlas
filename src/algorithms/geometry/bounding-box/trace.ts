// 轴对齐最小包围盒 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import type { BarRole, GraphNode } from '../../../types.ts';
import { boundingBox, type Pt } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  const points: Pt[] = [
    { x: 1, y: 2 },
    { x: 3, y: 5 },
    { x: 6, y: 1 },
    { x: 4, y: 7 },
    { x: 0, y: 3 },
    { x: 7, y: 6 },
  ];

  const minX0 = -1;
  const maxX0 = 9;
  const minY0 = -1;
  const maxY0 = 9;
  const norm = (pt: Pt): { x: number; y: number } => {
    const pad = 0.1;
    const sx = maxX0 - minX0;
    const sy = maxY0 - minY0;
    return {
      x: pad + ((pt.x - minX0) / sx) * (1 - 2 * pad),
      y: pad + (1 - (pt.y - minY0) / sy) * (1 - 2 * pad),
    };
  };

  const polyNodes: GraphNode[] = points.map((p, i) => ({
    id: `p${i}`,
    label: `${i}`,
    ...norm(p),
    role: 'default',
  }));

  // 逐点展示当前包围盒
  let stats: ReturnType<typeof boundingBox> | null = null;
  stats = boundingBox(points, {
    onPoint: (i, cur) => {
      const visited: GraphNode[] = points.map((p, j) => ({
        id: `p${j}`,
        label: `${j}`,
        ...norm(p),
        role: (j <= i ? 'frontier' : 'default') as BarRole,
      }));
      // 加 4 个角的虚拟节点表示当前 AABB
      const corners = [
        { x: cur.minX, y: cur.minY },
        { x: cur.maxX, y: cur.minY },
        { x: cur.maxX, y: cur.maxY },
        { x: cur.minX, y: cur.maxY },
      ];
      const cornerNodes: GraphNode[] = corners.map((c, k) => ({
        id: `c${k}`,
        label: ``,
        ...norm(c),
        role: 'compare',
      }));
      const boxEdges = [
        { from: 'c0', to: 'c1', role: 'compare' as const },
        { from: 'c1', to: 'c2', role: 'compare' as const },
        { from: 'c2', to: 'c3', role: 'compare' as const },
        { from: 'c3', to: 'c0', role: 'compare' as const },
      ];
      rec
        .begin({ zh: `扫描第 ${i} 个点`, en: `Scanning point ${i}` })
        .setGraph([...visited, ...cornerNodes], boxEdges)
        .commit();
    },
  });

  // 终态
  const s = stats!;
  const corners = [
    { x: s.bbox.minX, y: s.bbox.minY },
    { x: s.bbox.maxX, y: s.bbox.minY },
    { x: s.bbox.maxX, y: s.bbox.maxY },
    { x: s.bbox.minX, y: s.bbox.maxY },
  ];
  const cornerNodes: GraphNode[] = corners.map((c, k) => ({
    id: `cf${k}`,
    label: ``,
    ...norm(c),
    role: 'final',
  }));
  const boxEdges = [
    { from: 'cf0', to: 'cf1', role: 'final' as const },
    { from: 'cf1', to: 'cf2', role: 'final' as const },
    { from: 'cf2', to: 'cf3', role: 'final' as const },
    { from: 'cf3', to: 'cf0', role: 'final' as const },
  ];
  rec
    .begin({
      zh: `AABB: ${s.width}×${s.height}，面积 ${s.area.toFixed(2)}`,
      en: `AABB: ${s.width}×${s.height}, area ${s.area.toFixed(2)}`,
    })
    .setGraph([...polyNodes, ...cornerNodes], boxEdges)
    .setAux([
      { label: `宽`, value: String(s.width) },
      { label: `高`, value: String(s.height) },
      { label: `面积`, value: s.area.toFixed(2) },
    ])
    .commit();

  return rec.build();
}
