import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { largeFactorial, type LargeFactorialHooks } from './impl.ts';

export const DEFAULT_N = 10;

function digitCount(b: bigint): number {
  if (b === 0n) return 1;
  return b.toString().length;
}

export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const steps: Array<{ i: number; digits: number }> = [];

  rec
    .begin({ zh: `计算 ${n}!`, en: `Compute ${n}!` })
    .setAux([{ label: '输入', value: String(n), role: 'frontier' }])
    .commit();

  const hooks: LargeFactorialHooks = {
    onStep: (i, current) => {
      steps.push({ i, digits: digitCount(current) });
      rec
        .begin({ zh: `${i}! = ${current}`, en: `${i}! = ${current}` })
        .setBars(
          steps.map((s) => ({
            value: s.digits,
            role: (s.i === i ? 'compare' : 'sorted') as BarRole,
          })),
        )
        .setAux([
          { label: 'i', value: String(i), role: 'frontier' },
          { label: '位数', value: String(digitCount(current)), role: 'compare' },
        ])
        .commit();
    },
  };

  const ans = largeFactorial(n, hooks);

  rec
    .begin({ zh: `${n}! 共 ${digitCount(ans)} 位`, en: `${n}! has ${digitCount(ans)} digits` })
    .setAux([{ label: '结果', value: ans.toString(), role: 'final' }])
    .commit();

  return rec.build();
}
