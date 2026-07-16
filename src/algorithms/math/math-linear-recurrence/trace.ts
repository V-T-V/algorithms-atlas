import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { linearRecurrence, type LinearRecurrenceHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  coefs: [1, 1], // a_n = a_{n-1} + a_{n-2}（斐波那契）
  seeds: [0, 1], // a_0=0, a_1=1
};
export const DEFAULT_N = 10;

export function buildTrace(
  input: { coefs: number[]; seeds: number[] } = DEFAULT_INPUT,
  n: number = DEFAULT_N,
): Frame[] {
  const rec = new TraceRecorder();
  let mulCount = 0;

  rec
    .begin({
      zh: `a_${n}，k=${input.coefs.length}`,
      en: `a_${n}, k=${input.coefs.length}`,
    })
    .setAux([
      { label: 'n', value: String(n), role: 'frontier' },
      { label: 'k', value: String(input.coefs.length), role: 'frontier' },
    ])
    .commit();

  const hooks: LinearRecurrenceHooks = {
    onMultiply: () => {
      mulCount++;
      rec
        .begin({ zh: `矩阵乘 #${mulCount}`, en: `Mat mul #${mulCount}` })
        .setBars([{ value: mulCount, role: 'compare' as BarRole }])
        .setAux([{ label: '乘法次数', value: String(mulCount), role: 'compare' }])
        .commit();
    },
  };

  const ans = linearRecurrence(input, n, hooks);

  rec
    .begin({ zh: `a_${n} = ${ans}`, en: `a_${n} = ${ans}` })
    .setAux([{ label: '结果', value: ans.toString(), role: 'final' }])
    .commit();

  return rec.build();
}
