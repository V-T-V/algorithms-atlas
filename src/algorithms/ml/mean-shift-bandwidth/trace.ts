// Mean-Shift · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import type { BarRole, GraphNode } from '../../../types.ts';
import { meanShift, type Point } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
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
    .begin({ zh: `${points.length} 个点，带宽 h=1`, en: `${points.length} points, bandwidth h=1` })
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

  const result = meanShift(points, 1, 100, 1e-4, 0.5);

  const palette: BarRole[] = ['compare', 'final'];
  const nodes: GraphNode[] = points.map((p, i) => ({
    id: `p${i}`,
    label: `${i}`,
    ...norm(p),
    role: palette[result.labels[i]! % 2] ?? 'default',
  }));
  for (let m = 0; m < result.modes.length; m++) {
    nodes.push({ id: `m${m}`, label: `M${m}`, ...norm(result.modes[m]!), role: 'pivot' });
  }
  rec
    .begin({
      zh: `收敛到 ${result.modes.length} 个模式点`,
      en: `Converged to ${result.modes.length} modes`,
    })
    .setGraph(nodes, [])
    .setAux([
      { label: `模式点数`, value: String(result.modes.length) },
      { label: `总漂移次数`, value: String(result.iterations) },
    ])
    .commit();

  return rec.build();
}
