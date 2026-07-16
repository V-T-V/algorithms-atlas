// 外点对圆的切线 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import type { GraphNode } from '../../../types.ts';
import { circleTangent, type Pt } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  const c: Pt = { x: 0, y: 0 };
  const r = 2;
  const t: Pt = { x: 4, y: 4 };

  const range = 7;
  const norm = (pt: Pt): { x: number; y: number } => {
    const pad = 0.1;
    return {
      x: pad + ((pt.x + range) / (2 * range)) * (1 - 2 * pad),
      y: pad + (1 - (pt.y + range) / (2 * range)) * (1 - 2 * pad),
    };
  };

  // 初始
  const nodes0: GraphNode[] = [
    { id: 'c', label: 'C', ...norm(c), role: 'pivot' },
    { id: 't', label: 'T', ...norm(t), role: 'compare' },
  ];
  rec
    .begin({ zh: `圆 (C, r=${r}) 与外点 T`, en: `Circle (C, r=${r}) and external point T` })
    .setGraph(nodes0, [])
    .setAux([
      { label: `圆心 C`, value: `(${c.x}, ${c.y})` },
      { label: `半径`, value: String(r) },
      { label: `外点 T`, value: `(${t.x}, ${t.y})` },
    ])
    .commit();

  let alpha = 0;
  let phi = 0;
  const res = circleTangent(c, r, t, {
    onBearing: (a) => (alpha = a),
    onAngle: (p) => (phi = p),
  });

  const pts = res.tangentPoints;
  const nodes1: GraphNode[] = [
    { id: 'c', label: 'C', ...norm(c), role: 'pivot' },
    { id: 't', label: 'T', ...norm(t), role: 'compare' },
    { id: 'p1', label: 'P1', ...norm(pts[0]!), role: 'final' },
    { id: 'p2', label: 'P2', ...norm(pts[1]!), role: 'final' },
  ];
  rec
    .begin({ zh: `两个切点 P1、P2`, en: `Tangent points P1 and P2` })
    .setGraph(nodes1, [
      { from: 't', to: 'p1', role: 'final' },
      { from: 't', to: 'p2', role: 'final' },
    ])
    .setAux([
      { label: `方位角 α`, value: alpha.toFixed(4) },
      { label: `夹角 φ`, value: phi.toFixed(4) },
      { label: `切线长`, value: res.tangentLength.toFixed(4) },
    ])
    .commit();

  return rec.build();
}
