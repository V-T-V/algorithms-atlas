import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gcdTail } from './impl.ts';

export const DEFAULT_A = 252;
export const DEFAULT_B = 105;

export function buildTrace(opts: { a?: number; b?: number } = {}): Frame[] {
  const a = opts.a ?? DEFAULT_A;
  const b = opts.b ?? DEFAULT_B;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 gcd(${a},${b})`, en: `Init gcd(${a},${b})` })
    .setBars([
      { value: a, role: 'default' as BarRole, label: `a=${a}` },
      { value: b, role: 'default' as BarRole, label: `b=${b}` },
    ])
    .setAux([{ label: '目标', value: `gcd(${a},${b})`, role: 'compare' as BarRole }])
    .commit();

  gcdTail(a, b, 0, {
    onCall: (aa, bb, depth) => {
      rec
        .begin({
          zh: `递归 depth=${depth} gcd(${aa},${bb})`,
          en: `recurse depth=${depth} gcd(${aa},${bb})`,
        })
        .setBars([
          { value: aa, role: 'pivot' as BarRole, label: `a=${aa}` },
          { value: bb, role: 'final' as BarRole, label: `b=${bb}` },
        ])
        .setAux([
          { label: 'depth', value: String(depth), role: 'compare' as BarRole },
          { label: 'a mod b', value: String(aa % bb), role: 'final' as BarRole },
        ])
        .commit();
    },
  });

  const result = gcdTail(a, b);
  rec
    .begin({ zh: `完成 gcd=${result}`, en: `Done gcd=${result}` })
    .setAux([{ label: '结果', value: String(result), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
