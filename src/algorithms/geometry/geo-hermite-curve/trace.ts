// =============================================================================
// Hermite 曲线 · 录制帧序列
// =============================================================================

import type { Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sampleHermite, type Point } from './impl.ts';

export const DEFAULT_INPUT = {
  p0: { x: 0, y: 0 },
  p1: { x: 5, y: 0 },
  m0: { x: 4, y: 4 },
  m1: { x: 0, y: -4 },
};
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
  const pad = 0.12;
  return (p) => ({
    x: pad + (0.5 - pad) * 2 * ((p.x - minX) / spanX),
    y: pad + (0.5 - pad) * 2 * (1 - (p.y - minY) / spanY),
  });
}

export function buildTrace(
  input: { p0: Point; p1: Point; m0: Point; m1: Point; samples: number } = {
    ...DEFAULT_INPUT,
    samples: DEFAULT_SAMPLES,
  },
): Frame[] {
  const rec = new TraceRecorder();
  const { p0, p1, m0, m1, samples } = input;
  const norm = normalizer([
    p0,
    p1,
    { x: p0.x + m0.x, y: p0.y + m0.y },
    { x: p1.x + m1.x, y: p1.y + m1.y },
  ]);

  rec
    .begin({
      zh: `Hermite：P0(${p0.x},${p0.y}) → P1(${p1.x},${p1.y})，切向 m0/m1`,
      en: `Hermite: P0(${p0.x},${p0.y}) → P1(${p1.x},${p1.y}), tangents m0/m1`,
    })
    .setGraph(
      [
        { id: 'p0', label: 'P0', x: norm(p0).x, y: norm(p0).y, role: 'pivot' },
        { id: 'p1', label: 'P1', x: norm(p1).x, y: norm(p1).y, role: 'pivot' },
      ],
      [],
    )
    .setAux([
      { label: 'P0', value: `(${p0.x},${p0.y})`, role: 'pivot' },
      { label: 'P1', value: `(${p1.x},${p1.y})`, role: 'pivot' },
      { label: 'm0', value: `(${m0.x},${m0.y})`, role: 'frontier' },
      { label: 'm1', value: `(${m1.x},${m1.y})`, role: 'frontier' },
    ])
    .commit();

  const curve = sampleHermite(p0, p1, m0, m1, samples, {
    onPoint: (t, p) => {
      if (Math.abs(t % 0.25) < 1e-9 || t === 0 || t > 0.99) {
        const nodes: GraphNode[] = [
          { id: 'p0', label: 'P0', x: norm(p0).x, y: norm(p0).y, role: 'pivot' },
          { id: 'p1', label: 'P1', x: norm(p1).x, y: norm(p1).y, role: 'pivot' },
        ];
        rec
          .begin({
            zh: `t=${t.toFixed(2)} → H(t)=(${p.x.toFixed(2)},${p.y.toFixed(2)})`,
            en: `t=${t.toFixed(2)} → H(t)=(${p.x.toFixed(2)},${p.y.toFixed(2)})`,
          })
          .setGraph(nodes, [])
          .setAux([
            { label: 't', value: t.toFixed(2), role: 'frontier' },
            { label: 'H(t)', value: `(${p.x.toFixed(2)},${p.y.toFixed(2)})`, role: 'final' },
          ])
          .commit();
      }
    },
  });

  const nodes: GraphNode[] = [
    { id: 'p0', label: 'P0', x: norm(p0).x, y: norm(p0).y, role: 'pivot' },
    { id: 'p1', label: 'P1', x: norm(p1).x, y: norm(p1).y, role: 'pivot' },
    ...curve.map((p, i) => ({
      id: 'k' + i,
      label: '',
      x: norm(p).x,
      y: norm(p).y,
      role: 'final' as const,
    })),
  ];
  const edges: GraphEdge[] = [];
  for (let i = 0; i < curve.length - 1; i++) {
    edges.push({ from: 'k' + i, to: 'k' + (i + 1), role: 'sorted' });
  }
  rec
    .begin({
      zh: `完成：Hermite 曲线 ${curve.length} 点`,
      en: `Done: Hermite curve, ${curve.length} points`,
    })
    .setGraph(nodes, edges)
    .setAux([{ label: '采样点数', value: String(curve.length), role: 'final' }])
    .commit();

  return rec.build();
}
