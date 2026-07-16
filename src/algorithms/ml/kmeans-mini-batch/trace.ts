// 小批量 K-均值 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import type { BarRole, GraphNode } from '../../../types.ts';
import { miniBatchKMeans, type Point } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  // 3 个明显簇
  const points: Point[] = [
    { x: 1, y: 1 },
    { x: 1.5, y: 0.5 },
    { x: 0.5, y: 1.5 },
    { x: 2, y: 1 },
    { x: 5, y: 5 },
    { x: 5.5, y: 4.5 },
    { x: 4.5, y: 5.5 },
    { x: 5, y: 6 },
    { x: 9, y: 1 },
    { x: 9.5, y: 0.5 },
    { x: 8.5, y: 1.5 },
    { x: 9, y: 2 },
  ];

  const norm = (p: Point): { x: number; y: number } => {
    const pad = 0.1;
    return {
      x: pad + (p.x / 10) * (1 - 2 * pad),
      y: pad + (1 - p.y / 7) * (1 - 2 * pad),
    };
  };

  const draw = (
    note: { zh: string; en: string },
    centroids: Point[],
    assignments: number[] | null,
  ) => {
    const palette: BarRole[] = ['compare', 'final', 'frontier'];
    const nodes: GraphNode[] = points.map((p, i) => {
      const role = assignments ? (palette[assignments[i]! % 3] ?? 'default') : 'default';
      return { id: `p${i}`, label: '', ...norm(p), role };
    });
    for (let c = 0; c < centroids.length; c++) {
      nodes.push({ id: `c${c}`, label: `C${c}`, ...norm(centroids[c]!), role: 'pivot' });
    }
    rec.begin(note).setGraph(nodes, []).commit();
  };

  draw(
    { zh: `12 个点，K=3`, en: `12 points, K=3` },
    [
      { x: 1, y: 1 },
      { x: 5, y: 5 },
      { x: 9, y: 1 },
    ],
    null,
  );

  let lastCentroids: Point[] = [];
  miniBatchKMeans(points, 3, 6, 30, 42, {
    onIteration: (_iter, cs) => {
      lastCentroids = cs;
    },
  });

  const final = miniBatchKMeans(points, 3, 6, 30, 42);
  draw(
    { zh: `迭代中…`, en: `Iterating...` },
    lastCentroids.length ? lastCentroids : final.centroids,
    null,
  );
  draw(
    {
      zh: `最终聚类结果（${final.iterations} 轮）`,
      en: `Final clustering (${final.iterations} iters)`,
    },
    final.centroids,
    final.assignments,
  );

  return rec.build();
}
