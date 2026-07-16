import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dictatorGame } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '独裁者: e=10 给 3', en: 'Dictator: e=10 give 3' }).commit();
  dictatorGame(10, 3, {
    onPayoff: (d, r) =>
      rec
        .begin({ zh: `独裁者=${d} 接收者=${r}`, en: `dictator=${d} recipient=${r}` })
        .setBars([
          { value: d, role: 'final' as BarRole, label: 'D' },
          { value: r, role: 'compare' as BarRole, label: 'R' },
        ])
        .commit(),
  });
  return rec.build();
}
