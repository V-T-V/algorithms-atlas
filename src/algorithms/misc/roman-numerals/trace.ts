// =============================================================================
// 罗马数字 · 录制帧序列
// 用 aux 展示整数→罗马的逐步累加过程。
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { intToRoman, type IntToRomanHooks } from './impl.ts';

export const DEFAULT_INPUT = 1994; // MCMXCIV

/** 录制演示帧序列（演示整数→罗马的贪心过程）。 */
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let accumulated = '';
  let rest = n;

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        { label: '目标 n', value: String(n), role: 'frontier' },
        { label: '剩余', value: String(rest), role: 'pivot' },
        { label: '已生成', value: accumulated || '—', role: 'final' },
        { label: '符号对', value: 'M CM D CD C XC L XL X IX V IV I', role: 'default' },
      ])
      .commit();
  };

  render({
    zh: `将 ${n} 转为罗马数字`,
    en: `Convert ${n} to Roman numerals`,
  });

  const hooks: IntToRomanHooks = {
    onSymbol: (value, symbol) => {
      accumulated += symbol;
      rest -= value;
      render({
        zh: `减去 ${value}（${symbol}），剩余 ${rest} → ${accumulated}`,
        en: `Subtract ${value} (${symbol}), rest ${rest} → ${accumulated}`,
      });
    },
  };

  const result = intToRoman(n, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：${n} = ${result}`,
      en: `Done: ${n} = ${result}`,
    })
    .setAux([
      { label: '整数', value: String(n), role: 'frontier' },
      { label: '罗马数字', value: result, role: 'final' },
      { label: '符号数', value: String(result.length), role: 'default' },
    ])
    .commit();

  return rec.build();
}
