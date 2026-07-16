// =============================================================================
// Voronoi 图 · 录制帧序列
// =============================================================================

import type { Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { voronoi, type Point } from './impl.ts';

export const DEFAULT_INPUT: Point[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 2, y: 4 },
  { x: 6, y: 2 },
  { x: 5, y: 6 },
];

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

export function buildTrace(sites: readonly Point[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const norm = normalizer(sites);
  const collected: Point[] = [];

  const siteNodes: GraphNode[] = sites.map((p, i) => ({
    id: 's' + i,
    label: String(i),
    x: norm(p).x,
    y: norm(p).y,
    role: 'pivot',
  }));

  rec
    .begin({
      zh: `Voronoi：${sites.length} 个 site，计算各 Voronoi 顶点（空圆外心）`,
      en: `Voronoi: ${sites.length} sites, compute vertices (empty-circle circumcenters)`,
    })
    .setGraph(siteNodes, [])
    .setAux([{ label: 'site 数', value: String(sites.length), role: 'pivot' }])
    .commit();

  const verts = voronoi(sites, {
    onVertex: (v) => {
      collected.push(v.center);
      const nodes: GraphNode[] = [
        ...siteNodes,
        ...collected.map((c, i) => ({
          id: 'v' + i,
          label: '',
          x: norm(c).x,
          y: norm(c).y,
          role: 'final' as const,
        })),
      ];
      rec
        .begin({
          zh: `发现 Voronoi 顶点 (${v.center.x.toFixed(2)},${v.center.y.toFixed(2)})（空圆 r=${v.radius.toFixed(2)}）`,
          en: `Voronoi vertex (${v.center.x.toFixed(2)},${v.center.y.toFixed(2)}) (empty r=${v.radius.toFixed(2)})`,
        })
        .setGraph(nodes, [])
        .setAux([
          { label: '顶点数', value: String(collected.length), role: 'final' },
          { label: '半径', value: v.radius.toFixed(2), role: 'compare' },
        ])
        .commit();
    },
  });

  // 连接相邻 Voronoi 顶点（共享两个 site）形成 Voronoi 边
  const nodes: GraphNode[] = [
    ...siteNodes,
    ...verts.map((v, i) => ({
      id: 'v' + i,
      label: '',
      x: norm(v.center).x,
      y: norm(v.center).y,
      role: 'final' as const,
    })),
  ];
  const edges: GraphEdge[] = [];
  for (let i = 0; i < verts.length; i++) {
    for (let j = i + 1; j < verts.length; j++) {
      const shared = verts[i]!.sites.filter((s) => verts[j]!.sites.includes(s));
      if (shared.length >= 2) {
        edges.push({ from: 'v' + i, to: 'v' + j, role: 'compare' });
      }
    }
  }
  rec
    .begin({
      zh: `完成：${verts.length} 个 Voronoi 顶点，${edges.length} 条 Voronoi 边`,
      en: `Done: ${verts.length} vertices, ${edges.length} edges`,
    })
    .setGraph(nodes, edges)
    .setAux([
      { label: '顶点数', value: String(verts.length), role: 'final' },
      { label: '边数', value: String(edges.length), role: 'final' },
    ])
    .commit();

  return rec.build();
}
