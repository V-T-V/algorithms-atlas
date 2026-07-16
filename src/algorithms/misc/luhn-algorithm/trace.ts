// =============================================================================
// Luhn 校验 · 录制帧序列
// 用 setArray 展示每位及其有效值，高亮当前处理位、加倍位、校验位。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { luhnCheck, parseDigits, type LuhnHooks } from './impl.ts';

export const DEFAULT_INPUT = '4532015112830366';

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const arr = parseDigits(input) ?? [];
  const len = arr.length;

  /** 每位的有效（加倍处理后）值。 */
  const effective: number[] = [...arr];
  /** 每位是否被加倍。 */
  const doubledFlags: boolean[] = arr.map((_, i) => (len - 1 - i) % 2 === 1);
  let cursor = -1;
  let runningSum = 0;
  let finalValid = false;

  const render = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = arr.map((_, i) => {
      if (i === cursor) return 'swap';
      if (doubledFlags[i]) return 'pivot';
      return 'default';
    });
    rec
      .begin(note)
      .setArray(effective, roles, cursor >= 0 ? [{ index: cursor, label: '处理' }] : [])
      .setAux([
        { label: '运行和', value: String(runningSum), role: 'frontier' },
        { label: '位数', value: String(len), role: 'default' },
        { label: '校验和 mod 10', value: String(runningSum % 10), role: 'warn' },
      ])
      .commit();
  };

  render({
    zh: `Luhn 校验号码：${input}`,
    en: `Luhn check on: ${input}`,
  });

  const hooks: LuhnHooks = {
    onDigit: (i, _digit, eff, doubled) => {
      cursor = i;
      effective[i] = eff;
      doubledFlags[i] = doubled;
      runningSum += eff;
      render({
        zh: doubled
          ? `第 ${i + 1} 位 ×2 → ${eff > 9 ? eff + '（减 9）' : eff}，运行和 ${runningSum}`
          : `第 ${i + 1} 位 = ${eff}，运行和 ${runningSum}`,
        en: doubled
          ? `digit ${i + 1} ×2 → ${eff > 9 ? eff + ' (−9)' : eff}, running sum ${runningSum}`
          : `digit ${i + 1} = ${eff}, running sum ${runningSum}`,
      });
    },
    onSum: (sum) => {
      runningSum = sum;
    },
    onResult: (valid) => {
      finalValid = valid;
    },
  };

  luhnCheck(arr, hooks);

  // 终态
  rec
    .begin({
      zh: `校验和 ${runningSum} mod 10 = ${runningSum % 10} → ${finalValid ? '有效 ✓' : '无效 ✗'}`,
      en: `Checksum ${runningSum} mod 10 = ${runningSum % 10} → ${finalValid ? 'valid ✓' : 'invalid ✗'}`,
    })
    .setArray(
      effective,
      arr.map(() => 'final' as BarRole),
      [],
    )
    .setAux([
      { label: '总校验和', value: String(runningSum), role: 'final' },
      { label: 'mod 10', value: String(runningSum % 10), role: finalValid ? 'final' : 'warn' },
      {
        label: '结论',
        value: finalValid ? '有效 ✓' : '无效 ✗',
        role: finalValid ? 'final' : 'warn',
      },
    ])
    .commit();

  return rec.build();
}
