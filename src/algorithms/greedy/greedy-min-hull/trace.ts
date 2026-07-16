import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { giftWrapping, type Pt } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const pts: Pt[] = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
    { x: 2, y: 2 },
  ];
  rec
    .begin({ zh: 'Gift Wrapping 凸包', en: 'Gift wrapping hull' })
    .setGraph(
      pts.map((p, i) => ({ id: String(i), x: p.x / 5, y: p.y / 5 })),
      [],
    )
    .commit();
  const hull = giftWrapping(pts, {
    onConclude: (h) =>
      rec
        .begin({ zh: `凸包 ${h.length} 点`, en: `hull ${h.length} pts` })
        .setBars([{ value: h.length, role: 'final' as BarRole }])
        .commit(),
  });
  void hull;
  return rec.build();
}
