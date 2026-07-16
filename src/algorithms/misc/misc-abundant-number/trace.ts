import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isAbundant } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 12;
  rec.begin({ zh: `过剩数判定 ${n}`, en: `Abundant ${n}` }).commit();
  const ab = isAbundant(n, {
    onDivisor: (d) => rec.begin({ zh: `因子 ${d}`, en: `divisor ${d}` }).commit(),
    onConclude: (s, a) =>
      rec
        .begin({
          zh: `${n} 因子和=${s} ${a ? '过剩' : '非过剩'}`,
          en: `${n} sum=${s} ${a ? 'abundant' : 'not'}`,
        })
        .setAux([
          { label: 'sum', value: String(s), role: 'pivot' as BarRole },
          {
            label: 'abundant',
            value: a ? 'YES' : 'NO',
            role: a ? ('final' as BarRole) : ('warn' as BarRole),
          },
        ])
        .commit(),
  });
  void ab;
  return rec.build();
}
