import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fibonacciTail } from './impl.ts';

export const DEFAULT_N = 10;

export function buildTrace(opts: { n?: number } = {}): Frame[] {
  const n = opts.n ?? DEFAULT_N;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 fib(${n})`, en: `Init fib(${n})` })
    .setBars(
      Array.from({ length: Math.min(n, 12) }, (_, i) => ({
        value: i + 1,
        role: 'default' as BarRole,
        label: `f${i}`,
      })),
    )
    .setAux([{ label: '目标', value: `fib(${n})`, role: 'compare' as BarRole }])
    .commit();

  fibonacciTail(n, 0n, 1n, 0, {
    onCall: (nn, a, b, depth) => {
      rec
        .begin({
          zh: `递归 depth=${depth} n=${nn} a=${a} b=${b}`,
          en: `recurse depth=${depth} n=${nn} a=${a} b=${b}`,
        })
        .setBars(
          Array.from({ length: Math.min(n, 12) }, (_, i) => ({
            value: i + 1,
            role: (i + 1 > n - nn ? 'sorted' : 'default') as BarRole,
            label: `f${i}`,
          })),
        )
        .setAux([
          { label: 'a', value: a.toString(), role: 'final' as BarRole },
          { label: 'b', value: b.toString(), role: 'compare' as BarRole },
        ])
        .commit();
    },
  });

  const result = fibonacciTail(n);
  rec
    .begin({ zh: `完成 fib(${n})=${result}`, en: `Done fib(${n})=${result}` })
    .setAux([{ label: '结果', value: result.toString(), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
