// 过点作直线垂线 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import type { GraphNode } from '../../../types.ts';
import { perpendicularLine, type Pt } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  const a: Pt = { x: 0, y: 0 };
  const b: Pt = { x: 4, y: 0 };
  const p: Pt = { x: 2, y: 3 };

  const range = 5;
  const norm = (pt: Pt): { x: number; y: number } => {
    const pad = 0.1;
    return {
      x: pad + (pt.x / range) * (1 - 2 * pad),
      y: pad + (1 - pt.y / range) * (1 - 2 * pad),
    };
  };

  // 初始：仅展示直线 AB 与点 P
  const nodes0: GraphNode[] = [
    { id: 'a', label: 'A', ...norm(a), role: 'default' },
    { id: 'b', label: 'B', ...norm(b), role: 'default' },
    { id: 'p', label: 'P', ...norm(p), role: 'compare' },
  ];
  rec
    .begin({ zh: `直线 AB 与点 P`, en: `Line AB and point P` })
    .setGraph(nodes0, [{ from: 'a', to: 'b', role: 'default' }])
    .setAux([
      { label: `A`, value: `(${a.x}, ${a.y})` },
      { label: `B`, value: `(${b.x}, ${b.y})` },
      { label: `P`, value: `(${p.x}, ${p.y})` },
    ])
    .commit();

  let foot: Pt | null = null;
  const line = perpendicularLine(a, b, p, {
    onFoot: (h) => (foot = h),
  });

  // 垂足
  const h = foot ?? { x: p.x, y: a.y };
  const nodes1: GraphNode[] = [
    { id: 'a', label: 'A', ...norm(a), role: 'default' },
    { id: 'b', label: 'B', ...norm(b), role: 'default' },
    { id: 'p', label: 'P', ...norm(p), role: 'compare' },
    { id: 'h', label: 'H', ...norm(h), role: 'final' },
  ];
  rec
    .begin({ zh: `垂足 H 与垂线 PH`, en: `Foot H and perpendicular PH` })
    .setGraph(nodes1, [
      { from: 'a', to: 'b', role: 'default' },
      { from: 'p', to: 'h', role: 'final' },
    ])
    .setAux([
      { label: `垂足 H`, value: `(${h.x.toFixed(2)}, ${h.y.toFixed(2)})` },
      { label: `法向量`, value: `(${line.nx}, ${line.ny})` },
    ])
    .commit();

  return rec.build();
}
