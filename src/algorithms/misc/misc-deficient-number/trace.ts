import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isDeficient } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 21;
  rec.begin({ zh: `亏数判定 ${n}`, en: `Deficient ${n}` }).commit();
  isDeficient(n, {
    onConclude: (s, d) =>
      rec
        .begin({
          zh: `${n} 因子和=${s} ${d ? '亏数' : '非亏'}`,
          en: `${n} sum=${s} ${d ? 'deficient' : 'not'}`,
        })
        .setBars([
          { value: s, role: 'pivot' as BarRole },
          { value: n, role: 'default' as BarRole },
        ])
        .commit(),
  });
  return rec.build();
}
