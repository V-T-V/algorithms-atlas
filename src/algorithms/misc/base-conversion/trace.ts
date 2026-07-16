// =============================================================================
// 进制转换 · 录制帧序列
// 用 aux 展示解析阶段的位权累加与生成阶段的取余倒序。
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  generateFromDecimal,
  parseToDecimal,
  type GenerateHooks,
  type ParseHooks,
} from './impl.ts';

export const DEFAULT_INPUT = { numStr: '255', fromBase: 10, toBase: 16 };

interface BuildTraceInput {
  numStr?: string;
  fromBase?: number;
  toBase?: number;
}

/** 录制演示帧序列。分「解析」「生成」两个阶段，分别展示中间状态。 */
export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const numStr = input.numStr ?? DEFAULT_INPUT.numStr;
  const fromBase = input.fromBase ?? DEFAULT_INPUT.fromBase;
  const toBase = input.toBase ?? DEFAULT_INPUT.toBase;

  const rec = new TraceRecorder();
  let parsed = 0;
  let generated = '';

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        { label: '源串', value: numStr, role: 'frontier' },
        { label: '源进制', value: String(fromBase), role: 'pivot' },
        { label: '目标进制', value: String(toBase), role: 'pivot' },
        { label: '十进制中间值', value: String(parsed), role: 'swap' },
        { label: '目标串', value: generated || '—', role: 'final' },
      ])
      .commit();
  };

  render({
    zh: `将 ${numStr}（${fromBase} 进制）转为 ${toBase} 进制`,
    en: `Convert ${numStr} (base ${fromBase}) to base ${toBase}`,
  });

  // 阶段一：解析源进制 → 十进制
  const parseHooks: ParseHooks = {
    onParse: (i, ch, value, decimal) => {
      parsed = decimal;
      render({
        zh: `解析第 ${i + 1} 位 '${ch}'（值 ${value}），累计 = ${decimal}`,
        en: `Parse digit ${i + 1} '${ch}' (value ${value}), accumulated = ${decimal}`,
      });
    },
  };
  parsed = parseToDecimal(numStr, fromBase, parseHooks);

  // 阶段二：十进制 → 目标进制
  const genHooks: GenerateHooks = {
    onGenerate: (step, rem, ch, quotient) => {
      generated = ch + generated;
      render({
        zh: `第 ${step} 次取余：${parsed} mod ${toBase} = ${rem}（'${ch}'），商 ${quotient}`,
        en: `Modulo #${step}: ${parsed} mod ${toBase} = ${rem} ('${ch}'), quotient ${quotient}`,
      });
      parsed = quotient;
    },
  };
  const result = generateFromDecimal(parsed, toBase, genHooks);

  const decimalValue = parseToDecimal(numStr, fromBase);

  // 终态
  rec
    .begin({
      zh: `完成：${numStr}（${fromBase}）= ${result}（${toBase}）`,
      en: `Done: ${numStr} (base ${fromBase}) = ${result} (base ${toBase})`,
    })
    .setAux([
      { label: '源', value: `${numStr} (base ${fromBase})`, role: 'frontier' },
      { label: '目标', value: `${result} (base ${toBase})`, role: 'final' },
      { label: '十进制', value: String(decimalValue), role: 'default' },
    ])
    .commit();

  return rec.build();
}
