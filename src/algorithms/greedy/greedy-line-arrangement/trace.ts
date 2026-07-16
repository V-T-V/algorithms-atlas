import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { segmentCover } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const pts = [1, 2, 3, 8, 9, 10, 20];
  rec
    .begin({ zh: '线段覆盖 L=3', en: 'Segment cover L=3' })
    .setArray(
      [...pts],
      pts.map(() => 'default' as BarRole),
      pts.map((p, i) => ({ index: i, label: String(p) })),
    )
    .commit();
  const n = segmentCover(pts, 3, {
    onPlace: (re, cov) =>
      rec
        .begin({ zh: `右端=${re} 覆盖${cov}点`, en: `right=${re} covers${cov}` })
        .setBars([{ value: cov, role: 'final' as BarRole }])
        .commit(),
  });
  rec.begin({ zh: `${n} 条线段`, en: `${n} segments` }).commit();
  return rec.build();
}
