// 谱聚类 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import type { BarRole, GraphNode } from '../../../types.ts';
import { spectralClustering, type Point } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  // 两个分离很好的簇（便于演示）
  const points: Point[] = [
    { x: 0, y: 0 },
    { x: 0.3, y: 0 },
    { x: 0, y: 0.3 },
    { x: 0.3, y: 0.3 },
    { x: 0.15, y: 0.15 },
    { x: 4, y: 4 },
    { x: 4.3, y: 4 },
    { x: 4, y: 4.3 },
    { x: 4.3, y: 4.3 },
    { x: 4.15, y: 4.15 },
  ];

  const norm = (p: Point): { x: number; y: number } => {
    const pad = 0.1;
    return {
      x: pad + (p.x / 5) * (1 - 2 * pad),
      y: pad + (1 - p.y / 5) * (1 - 2 * pad),
    };
  };

  rec
    .begin({ zh: `${points.length} 个点，k=2，σ=0.5`, en: `${points.length} points, k=2, σ=0.5` })
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

  let eigenvalues: number[] = [];
  const labels = spectralClustering(points, 2, 0.5, {
    onEigenvalues: (e) => (eigenvalues = e),
  });

  const palette: BarRole[] = ['compare', 'final'];
  const nodes: GraphNode[] = points.map((p, i) => ({
    id: `p${i}`,
    label: `${i}`,
    ...norm(p),
    role: palette[labels[i]! % 2] ?? 'default',
  }));
  rec
    .begin({ zh: `聚类完成（按标签着色）`, en: `Clustering done (colored by label)` })
    .setGraph(nodes, [])
    .setAux([
      { label: `最小特征值`, value: eigenvalues[0]?.toFixed(6) ?? '-' },
      { label: `次小特征值`, value: eigenvalues[1]?.toFixed(6) ?? '-' },
    ])
    .commit();

  return rec.build();
}
