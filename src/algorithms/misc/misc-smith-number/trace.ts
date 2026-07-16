import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isSmithNumber } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 666;
  rec.begin({ zh: `史密斯数 ${n}`, en: `Smith ${n}` }).commit();
  isSmithNumber(n, {
    onFactor: (p) => rec.begin({ zh: `因子 ${p}`, en: `factor ${p}` }).commit(),
    onConclude: (ds, fs, ok) =>
      rec
        .begin({
          zh: `${n} 数字和=${ds} 因子和=${fs} ${ok ? '史密斯' : '否'}`,
          en: `${n} dsum=${ds} fsum=${fs} ${ok ? 'smith' : 'no'}`,
        })
        .setAux([
          { label: 'ds', value: String(ds), role: 'pivot' as BarRole },
          { label: 'fs', value: String(fs), role: 'pivot' as BarRole },
          {
            label: 'smith',
            value: ok ? 'YES' : 'NO',
            role: ok ? ('final' as BarRole) : ('warn' as BarRole),
          },
        ])
        .commit(),
  });
  return rec.build();
}
