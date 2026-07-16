import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { happyRange } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '快乐数 [1,30]', en: 'Happy [1,30]' }).commit();
  const flags: boolean[] = [];
  const c = happyRange(1, 30, {
    onNumber: (n, h) => {
      flags.push(h);
    },
  });
  rec
    .begin({ zh: `${c} 个快乐数`, en: `${c} happy numbers` })
    .setBars(
      flags.map((f) => ({
        value: f ? 1 : 0,
        role: f ? ('final' as BarRole) : ('default' as BarRole),
      })),
    )
    .commit();
  return rec.build();
}
