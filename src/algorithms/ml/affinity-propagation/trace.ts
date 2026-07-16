// 近邻传播聚类 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import type { BarRole, GraphNode } from '../../../types.ts';
import { affinityPropagation, type Point } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  const points: Point[] = [
    { x: 0, y: 0 },
    { x: 0.5, y: 0.1 },
    { x: 0.1, y: 0.5 },
    { x: 0.6, y: 0.6 },
    { x: 5, y: 5 },
    { x: 5.5, y: 5.1 },
    { x: 5.1, y: 5.5 },
    { x: 5.6, y: 5.6 },
    { x: 10, y: 0 },
    { x: 10.5, y: 0.1 },
    { x: 10.1, y: 0.5 },
  ];

  const norm = (p: Point): { x: number; y: number } => {
    const pad = 0.1;
    return {
      x: pad + (p.x / 11) * (1 - 2 * pad),
      y: pad + (1 - p.y / 6) * (1 - 2 * pad),
    };
  };

  rec
    .begin({ zh: `${points.length} 个点`, en: `${points.length} points` })
    .setAux([{ label: `点数`, value: String(points.length) }])
    .commit();

  const result = affinityPropagation(points, undefined, 0.5, 200, 15);

  const palette: BarRole[] = ['compare', 'final', 'frontier'];
  const nodes: GraphNode[] = points.map((p, i) => ({
    id: `p${i}`,
    label: result.exemplars.includes(i) ? `★${i}` : `${i}`,
    ...norm(p),
    role: result.exemplars.includes(i) ? 'pivot' : (palette[result.labels[i]! % 3] ?? 'default'),
  }));
  rec
    .begin({
      zh: `自动选出 ${result.exemplars.length} 个代表点（★）`,
      en: `${result.exemplars.length} exemplars auto-selected (★)`,
    })
    .setGraph(nodes, [])
    .setAux([
      { label: `代表点数`, value: String(result.exemplars.length) },
      { label: `迭代轮数`, value: String(result.iterations) },
      { label: `收敛`, value: String(result.converged) },
    ])
    .commit();

  return rec.build();
}
