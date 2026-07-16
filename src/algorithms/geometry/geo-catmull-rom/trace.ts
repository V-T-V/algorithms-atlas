// =============================================================================
// Catmull-Rom 样条 · 录制帧序列
// =============================================================================

import type { Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { catmullRom, type Point } from './impl.ts';

export const DEFAULT_CONTROL: Point[] = [
  { x: 0, y: 0 },
  { x: 1, y: 3 },
  { x: 3, y: 0 },
  { x: 4, y: 3 },
  { x: 6, y: 0 },
];
export const DEFAULT_SAMPLES_PER_SEG = 8;

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
  const curve: Point[] = [];

  const controlNodes: GraphNode[] = control.map((p, i) => ({
    id: 'c' + i,
    label: 'P' + i,
    x: norm(p).x,
    y: norm(p).y,
    role: 'pivot',
  }));

  rec
    .begin({
      zh: `Catmull-Rom：${control.length} 控制点，每段 ${samplesPerSeg} 采样`,
      en: `Catmull-Rom: ${control.length} control points, ${samplesPerSeg} samples/seg`,
    })
    .setGraph(controlNodes, [])
    .setAux([{ label: '控制点', value: String(control.length), role: 'pivot' }])
    .commit();

  const sampled = catmullRom(control, samplesPerSeg, {
    onSegment: (seg) => {
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
      rec
        .begin({
          zh: `段 ${seg}：P${seg} → P${seg + 1}`,
          en: `Segment ${seg}: P${seg} → P${seg + 1}`,
        })
        .setGraph(nodes, [])
        .setAux([{ label: '当前段', value: String(seg), role: 'frontier' }])
        .commit();
    },
    onPoint: (_seg, _t, p) => {
      curve.push(p);
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
  const edges: GraphEdge[] = [];
  for (let i = 0; i < sampled.length - 1; i++) {
    edges.push({ from: 'k' + i, to: 'k' + (i + 1), role: 'sorted' });
  }
  rec
    .begin({ zh: `完成：曲线 ${sampled.length} 点`, en: `Done: curve of ${sampled.length} points` })
    .setGraph(nodes, edges)
    .setAux([{ label: '采样点数', value: String(sampled.length), role: 'final' }])
    .commit();

  return rec.build();
}
