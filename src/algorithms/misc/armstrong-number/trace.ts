// 水仙花数判定 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isArmstrongNumber, type ArmstrongHooks } from './impl.ts';

export const DEFAULT_INPUT = 153;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const digits = String(n).split('').map(Number);
  const partials: Array<{ digit: number; power: number; partial: number }> = [];
  let finalSum = 0;
  let finalOk = false;
  let curStep = -1;

  const render = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = digits.map((_, i) => (i === curStep ? 'compare' : 'sorted'));
    rec
      .begin(note)
      .setBars(digits.map((d, i) => ({ value: d, role: roles[i]!, label: String(d) })))
      .setAux([
        { label: '原数 n', value: String(n), role: 'pivot' as BarRole },
        { label: '位数', value: String(digits.length), role: 'frontier' as BarRole },
        ...partials.map((p, i) => ({
          label: `第 ${i + 1} 位`,
          value: `${p.digit}^${digits.length} = ${p.power} → 累加 ${p.partial}`,
          role: 'compare' as BarRole,
        })),
      ])
      .commit();
    curStep = -1;
  };

  render({ zh: `判定 ${n} 是否为水仙花数`, en: `Check if ${n} is an Armstrong number` });

  const hooks: ArmstrongHooks = {
    onDigits: (_nn, dd) => {
      render({ zh: `位数 n = ${dd}`, en: `Digit count = ${dd}` });
    },
    onDigit: (digit, power, partial) => {
      curStep = partials.length;
      partials.push({ digit, power, partial });
      render({
        zh: `${digit}^${digits.length} = ${power}，累加 = ${partial}`,
        en: `${digit}^${digits.length} = ${power}, partial = ${partial}`,
      });
    },
    onResult: (_nn, sum, ok) => {
      finalSum = sum;
      finalOk = ok;
    },
  };

  isArmstrongNumber(n, hooks);

  rec
    .begin({
      zh: finalOk ? `${n} 是水仙花数（和=${finalSum}）` : `${n} 不是水仙花数（和=${finalSum}）`,
      en: finalOk
        ? `${n} is Armstrong (sum=${finalSum})`
        : `${n} is not Armstrong (sum=${finalSum})`,
    })
    .setBars(
      digits.map((d) => ({
        value: d,
        role: (finalOk ? 'final' : 'warn') as BarRole,
        label: String(d),
      })),
    )
    .setAux([
      {
        label: '结果',
        value: finalOk ? '是 / yes' : '否 / no',
        role: (finalOk ? 'final' : 'warn') as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
