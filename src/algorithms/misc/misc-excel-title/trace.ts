// =============================================================================
// Excel 列号转换 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { convertToTitle, titleToNumber, type ExcelHooks } from './impl.ts';

export const DEFAULT_INPUT = 701;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const digits: Array<{ value: number; letter: string }> = [];

  rec
    .begin({ zh: `数字 ${input} → Excel 列标题`, en: `Number ${input} → Excel title` })
    .setAux([{ label: '输入', value: String(input), role: 'pivot' as BarRole }])
    .commit();

  const hooks: ExcelHooks = {
    onDigit: (value, letter) => digits.push({ value, letter }),
  };

  const title = convertToTitle(input, hooks);

  for (let i = 0; i < digits.length; i++) {
    const d = digits[i]!;
    rec
      .begin({
        zh: `第 ${digits.length - i} 位：值=${d.value} 字母='${d.letter}'`,
        en: `Position ${digits.length - i}: value=${d.value} letter='${d.letter}'`,
      })
      .setAux([
        { label: '位值', value: String(d.value), role: 'compare' as BarRole },
        { label: '字母', value: d.letter, role: 'final' as BarRole },
      ])
      .commit();
  }

  // 反向验证
  const back = titleToNumber(title);

  rec
    .begin({
      zh: `结果：${input} → "${title}"（反向验证：${back}）`,
      en: `Result: ${input} → "${title}" (round-trip: ${back})`,
    })
    .setAux([
      { label: '标题', value: title, role: 'final' as BarRole },
      { label: '往返', value: back === input ? '一致' : '不一致', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
