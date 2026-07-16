// 点对称 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import type { GraphNode } from '../../../types.ts';
import { reflectPoint, type Pt } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  const c: Pt = { x: 2, y: 2 };
  const p: Pt = { x: 4, y: 5 };

  const norm = (pt: Pt): { x: number; y: number } => {
    const minX = -1;
    const maxX = 6;
    const minY = -2;
    const maxY = 7;
    const spanX = maxX - minX;
    const spanY = maxY - minY;
    const pad = 0.1;
    return {
      x: pad + ((pt.x - minX) / spanX) * (1 - 2 * pad),
      y: pad + (1 - (pt.y - minY) / spanY) * (1 - 2 * pad),
    };
  };

  const draw = (note: { zh: string; en: string }, extra?: { reflected?: Pt; show?: boolean }) => {
    const nodes: GraphNode[] = [];
    const cn = norm(c);
    const pn = norm(p);
    nodes.push({ id: 'c', label: 'C', x: cn.x, y: cn.y, role: 'pivot' });
    nodes.push({ id: 'p', label: 'P', x: pn.x, y: pn.y, role: 'compare' });
    if (extra?.reflected && extra.show) {
      const rn = norm(extra.reflected);
      nodes.push({ id: 'r', label: "P'", x: rn.x, y: rn.y, role: 'final' });
    }
    rec
      .begin(note)
      .setGraph(nodes, [])
      .setAux([
        { label: `中心 C`, value: `(${c.x}, ${c.y})` },
        { label: `点 P`, value: `(${p.x}, ${p.y})` },
        ...(extra?.reflected && extra.show
          ? [{ label: `对称点 P'`, value: `(${extra.reflected.x}, ${extra.reflected.y})` }]
          : []),
      ])
      .commit();
  };

  draw({ zh: `输入：中心 C 与点 P`, en: `Input: center C and point P` });

  const r = reflectPoint(p, c, {
    onReflect: (pp, cc, rr) => {
      void pp;
      void cc;
      draw({ zh: `应用 P' = 2C − P`, en: `Apply P' = 2C − P` }, { reflected: rr, show: true });
    },
  });

  void r;

  return rec.build();
}
