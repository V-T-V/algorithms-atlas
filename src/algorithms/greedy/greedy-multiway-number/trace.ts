import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { multiwayNumber } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const nums = [9, 8, 7, 6, 5, 4, 3, 2, 1];
  rec.begin({ zh: '多路划分 k=3', en: 'Multiway partition k=3' }).commit();
  const r = multiwayNumber(nums, 3, {
    onConclude: (g, mx) =>
      rec
        .begin({ zh: `最大组和 ${mx}`, en: `max group sum ${mx}` })
        .setBars(
          g.map((gr) => ({ value: gr.reduce((a, b) => a + b, 0), role: 'pivot' as BarRole })),
        )
        .commit(),
  });
  void r;
  return rec.build();
}
