import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { factorialTail } from './impl.ts';

export const DEFAULT_N = 6;

export function buildTrace(opts: { n?: number } = {}): Frame[] {
  const n = opts.n ?? DEFAULT_N;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 fact(${n})`, en: `Init fact(${n})` })
    .setBars(
      Array.from({ length: n }, (_, i) => ({
        value: i + 1,
        role: 'default' as BarRole,
        label: String(i + 1),
      })),
    )
    .setAux([{ label: '目标', value: `${n}!`, role: 'compare' as BarRole }])
    .commit();

  factorialTail(n, 1n, 0, {
    onCall: (nn, acc, depth) => {
      rec
        .begin({
          zh: `递归 depth=${depth} n=${nn} acc=${acc}`,
          en: `recurse depth=${depth} n=${nn} acc=${acc}`,
        })
        .setBars(
          Array.from({ length: n }, (_, i) => ({
            value: i + 1,
            role: (i + 1 > nn ? 'sorted' : 'default') as BarRole,
            label: String(i + 1),
          })),
        )
        .setAux([
          { label: 'depth', value: String(depth), role: 'compare' as BarRole },
          { label: 'acc', value: String(acc), role: 'final' as BarRole },
        ])
        .commit();
    },
  });

  const result = factorialTail(n);
  rec
    .begin({ zh: `完成 ${n}!=${result}`, en: `Done ${n}!=${result}` })
    .setAux([{ label: '结果', value: result.toString(), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
