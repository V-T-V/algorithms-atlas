// BIRCH · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import type { BarRole, GraphNode } from '../../../types.ts';
import { birch, type Point } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  const points: Point[] = [
    { x: 0, y: 0 },
    { x: 0.2, y: 0 },
    { x: 0, y: 0.2 },
    { x: 0.2, y: 0.2 },
    { x: 0.1, y: 0.1 },
    { x: 0.15, y: 0.05 },
    { x: 4, y: 4 },
    { x: 4.2, y: 4 },
    { x: 4, y: 4.2 },
    { x: 4.2, y: 4.2 },
    { x: 4.1, y: 4.1 },
    { x: 4.15, y: 4.05 },
  ];

  const norm = (p: Point): { x: number; y: number } => {
    const pad = 0.1;
    return {
      x: pad + (p.x / 5) * (1 - 2 * pad),
      y: pad + (1 - p.y / 5) * (1 - 2 * pad),
    };
  };

  rec
    .begin({
      zh: `${points.length} 个点，阈值 T=0.3`,
      en: `${points.length} points, threshold T=0.3`,
    })
    .setGraph(
      points.map((p, i) => ({
        id: `p${i}`,
        label: `${i}`,
        ...norm(p),
        role: 'default' as BarRole,
      })),
      [],
    )
    .commit();

  const result = birch(points, 0.3);

  const palette: BarRole[] = ['compare', 'final', 'frontier'];
  const nodes: GraphNode[] = points.map((p, i) => ({
    id: `p${i}`,
    label: `${i}`,
    ...norm(p),
    role: palette[result.labels[i]! % 3] ?? 'default',
  }));
  for (let e = 0; e < result.entries.length; e++) {
    nodes.push({
      id: `c${e}`,
      label: `C${e}`,
      ...norm(result.entries[e]!.centroid),
      role: 'pivot',
    });
  }
  rec
    .begin({
      zh: `${result.entries.length} 个叶条目（质心 C★）`,
      en: `${result.entries.length} leaf entries (centroids C★)`,
    })
    .setGraph(nodes, [])
    .setAux([
      { label: `叶条目数`, value: String(result.entries.length) },
      { label: `点数`, value: String(points.length) },
    ])
    .commit();

  return rec.build();
}
