// 多边形周长 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { polygonPerimeter, type Pt } from './impl.ts';
export const DEFAULT_INPUT: Pt[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 3 },
  { x: 0, y: 3 },
];
export function buildTrace(input: Pt[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '多边形顶点', en: 'polygon vertices' }).commit();
  let acc = 0;
  const p = polygonPerimeter(input, {
    onEdge: (i, len) => {
      acc += len;
      rec
        .begin({
          zh: '边 ' + i + ' 长 ' + len.toFixed(2),
          en: 'edge ' + i + ' len ' + len.toFixed(2),
        })
        .setAux([{ label: '累计', value: acc.toFixed(2), role: 'compare' as BarRole }])
        .commit();
    },
  });
  rec
    .begin({ zh: '周长 = ' + p.toFixed(3), en: 'perimeter = ' + p.toFixed(3) })
    .setAux([{ label: '周长', value: p.toFixed(3), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
