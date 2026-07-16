import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { perfectPower } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 216;
  rec.begin({ zh: `完美幂判定 ${n}`, en: `Perfect power ${n}` }).commit();
  const r = perfectPower(n, {
    onConclude: (ok, a, b) =>
      rec
        .begin({
          zh: ok ? `${n}=${a}^${b}` : `${n} 不是完美幂`,
          en: ok ? `${n}=${a}^${b}` : `${n} not perfect`,
        })
        .setAux([
          {
            label: 'result',
            value: ok ? `${a}^${b}` : 'NO',
            role: ok ? ('final' as BarRole) : ('warn' as BarRole),
          },
        ])
        .commit(),
  });
  void r;
  return rec.build();
}
