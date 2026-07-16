import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isNarcissistic } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 153;
  rec.begin({ zh: `水仙花 ${n}`, en: `Narcissistic ${n}` }).commit();
  isNarcissistic(n, {
    onConclude: (s, ok) =>
      rec
        .begin({
          zh: `${n} 幂和=${s} ${ok ? '是' : '否'}`,
          en: `${n} sum=${s} ${ok ? 'yes' : 'no'}`,
        })
        .setBars([{ value: s, role: ok ? ('final' as BarRole) : ('warn' as BarRole) }])
        .commit(),
  });
  return rec.build();
}
