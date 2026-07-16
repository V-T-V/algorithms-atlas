// 递归求数字各位和 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sumDigits, type SumDigitsHooks } from './impl.ts';

export const DEFAULT_INPUT = 12345;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const digits = String(n).split('').map(Number);
  let resultVal = 0;
  const combineLog: Array<{ digit: number; result: number }> = [];

  const render = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = digits.map(() => 'sorted' as BarRole);
    rec
      .begin(note)
      .setBars(digits.map((d, i) => ({ value: d, role: roles[i]!, label: String(d) })))
      .setAux([
        { label: '输入', value: String(n), role: 'pivot' as BarRole },
        { label: '位数', value: String(digits.length), role: 'frontier' as BarRole },
        ...combineLog.map((c, i) => ({
          label: `第 ${i + 1} 次合并`,
          value: `+${c.digit} → ${c.result}`,
          role: 'compare' as BarRole,
        })),
      ])
      .commit();
  };

  render({ zh: `求 ${n} 各位数字之和`, en: `Sum the digits of ${n}` });

  const hooks: SumDigitsHooks = {
    onRecurse: (nn, digit) => {
      render({ zh: `n=${nn}，末位 = ${digit}`, en: `n=${nn}, last digit = ${digit}` });
    },
    onBase: () => {
      render({ zh: `n=0 → 基例返回 0`, en: `n=0 → base case returns 0` });
    },
    onCombine: (nn, digit, partial, result) => {
      combineLog.push({ digit, result });
      render({
        zh: `合并：${partial} + ${digit} = ${result}`,
        en: `Combine: ${partial} + ${digit} = ${result}`,
      });
    },
  };

  resultVal = sumDigits(n, hooks);

  rec
    .begin({ zh: `${n} 各位和 = ${resultVal}`, en: `digit sum of ${n} = ${resultVal}` })
    .setBars(digits.map((d) => ({ value: d, role: 'final' as BarRole, label: String(d) })))
    .setAux([{ label: '结果', value: String(resultVal), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
