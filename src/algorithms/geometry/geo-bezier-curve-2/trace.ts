// =============================================================================
// 贝塞尔曲线 · 录制帧序列
// =============================================================================

import type { Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bezierDeCasteljau, type Point } from './impl.ts';

export const DEFAULT_CONTROL: Point[] = [
  { x: 0, y: 0 },
  { x: 1, y: 3 },
  { x: 4, y: 3 },
  { x: 5, y: 0 },
];
export const DEFAULT_SAMPLES = 24;

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
  const pad = 0.1;
  return (p) => ({
    x: pad + (0.5 - pad) * 2 * ((p.x - minX) / spanX),
    y: pad + (0.5 - pad) * 2 * (1 - (p.y - minY) / spanY),
  });
}

export function buildTrace(
  input: { control: Point[]; samples: number } = {
    control: DEFAULT_CONTROL,
    samples: DEFAULT_SAMPLES,
  },
): Frame[] {
  const rec = new TraceRecorder();
  const { control, samples } = input;
  const norm = normalizer(control);
  const curve: Point[] = [];

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
      zh: `三次贝塞尔：4 控制点，采样 ${samples} 点`,
      en: `Cubic Bezier: 4 control points, ${samples} samples`,
    })
    .setGraph(controlNodes, polyEdges)
    .setAux([{ label: '控制点', value: String(control.length), role: 'pivot' }])
    .commit();

  for (let s = 0; s <= samples; s++) {
    const t = s / samples;
    const p = bezierDeCasteljau(control, t);
    curve.push(p);

    const nodes: GraphNode[] = [
      ...controlNodes,
      ...curve.map((q, i) => ({
        id: 'k' + i,
        label: '',
        x: norm(q).x,
        y: norm(q).y,
        role: 'final' as const,
      })),
    ];
    const edges: GraphEdge[] = [...polyEdges];
    for (let i = 0; i < curve.length - 1; i++) {
      edges.push({ from: 'k' + i, to: 'k' + (i + 1), role: 'sorted' });
    }

    if (s % 4 === 0 || s === samples) {
      rec
        .begin({
          zh: `t=${t.toFixed(2)} → B(t)=(${p.x.toFixed(2)},${p.y.toFixed(2)})`,
          en: `t=${t.toFixed(2)} → B(t)=(${p.x.toFixed(2)},${p.y.toFixed(2)})`,
        })
        .setGraph(nodes, edges)
        .setAux([
          { label: 't', value: t.toFixed(2), role: 'frontier' },
          { label: 'B(t)', value: `(${p.x.toFixed(2)},${p.y.toFixed(2)})`, role: 'final' },
          { label: '已采样', value: String(curve.length), role: 'frontier' },
        ])
        .commit();
    }
  }

  rec
    .begin({
      zh: `完成：生成 ${curve.length} 点贝塞尔曲线`,
      en: `Done: ${curve.length}-point Bezier curve`,
    })
    .setAux([{ label: '采样点数', value: String(curve.length), role: 'final' }])
    .commit();

  return rec.build();
}
