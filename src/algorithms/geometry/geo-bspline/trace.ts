// =============================================================================
// B 样条曲线 · 录制帧序列
// =============================================================================

import type { Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bspline, type Point } from './impl.ts';

export const DEFAULT_CONTROL: Point[] = [
  { x: 0, y: 0 },
  { x: 1, y: 2 },
  { x: 3, y: 3 },
  { x: 5, y: 1 },
  { x: 6, y: 3 },
];
export const DEFAULT_SAMPLES_PER_SEG = 10;

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
  const pad = 0.12;
  return (p) => ({
    x: pad + (0.5 - pad) * 2 * ((p.x - minX) / spanX),
    y: pad + (0.5 - pad) * 2 * (1 - (p.y - minY) / spanY),
  });
}

export function buildTrace(
  input: { control: Point[]; samplesPerSeg: number } = {
    control: DEFAULT_CONTROL,
    samplesPerSeg: DEFAULT_SAMPLES_PER_SEG,
  },
): Frame[] {
  const rec = new TraceRecorder();
  const { control, samplesPerSeg } = input;
  const norm = normalizer(control);

  const controlNodes: GraphNode[] = control.map((p, i) => ({
    id: 'c' + i,
    label: 'P' + i,
    x: norm(p).x,
    y: norm(p).y,
    role: 'pivot',
  }));
  const polyEdges: GraphEdge[] = control.slice(1).map((_, i) => ({
    from: 'c' + i,
    to: 'c' + (i + 1),
    role: 'compare',
  }));

  rec
    .begin({
      zh: `三次 B 样条：${control.length} 控制点（曲线不经过控制点）`,
      en: `Cubic B-spline: ${control.length} control points (curve approximates them)`,
    })
    .setGraph(controlNodes, polyEdges)
    .setAux([{ label: '控制点', value: String(control.length), role: 'pivot' }])
    .commit();

  const sampled = bspline(control, samplesPerSeg, {
    onSegment: (seg) => {
      rec
        .begin({
          zh: `采样段 ${seg}`,
          en: `Sampling segment ${seg}`,
        })
        .setGraph(controlNodes, polyEdges)
        .setAux([{ label: '当前段', value: String(seg), role: 'frontier' }])
        .commit();
    },
  });

  const nodes: GraphNode[] = [
    ...controlNodes,
    ...sampled.map((p, i) => ({
      id: 'k' + i,
      label: '',
      x: norm(p).x,
      y: norm(p).y,
      role: 'final' as const,
    })),
  ];
  const edges: GraphEdge[] = [...polyEdges];
  for (let i = 0; i < sampled.length - 1; i++) {
    edges.push({ from: 'k' + i, to: 'k' + (i + 1), role: 'sorted' });
  }
  rec
    .begin({
      zh: `完成：B 样条 ${sampled.length} 点`,
      en: `Done: B-spline of ${sampled.length} points`,
    })
    .setGraph(nodes, edges)
    .setAux([{ label: '采样点数', value: String(sampled.length), role: 'final' }])
    .commit();

  return rec.build();
}
