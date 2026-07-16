// Shannon-Fano · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shannonFano, encodeWith, type ShannonFanoHooks, type SFSymbol } from './impl.ts';

export interface SfInput {
  symbols: SFSymbol[];
  text: string;
}

export const DEFAULT_INPUT: SfInput = {
  symbols: [
    { symbol: 'A', freq: 5 },
    { symbol: 'B', freq: 3 },
    { symbol: 'C', freq: 2 },
    { symbol: 'D', freq: 1 },
  ],
  text: 'ABACABAD',
};

/** 录制演示帧序列。 */
export function buildTrace(input: SfInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { symbols, text } = input;

  rec
    .begin({ zh: `${symbols.length} 个符号`, en: `${symbols.length} symbols` })
    .setBars(symbols.map((s) => ({ value: s.freq, role: 'default' as BarRole })))
    .commit();

  const hooks: ShannonFanoHooks = {
    onSplit: (syms, left, right) => {
      rec
        .begin({
          zh: `分组：左 ${left.length} 个，右 ${right.length} 个`,
          en: `Split: ${left.length} left, ${right.length} right`,
        })
        .setAux([
          { label: '左(0)', value: left.join(','), role: 'compare' as BarRole },
          { label: '右(1)', value: right.join(','), role: 'swap' as BarRole },
        ])
        .commit();
      void syms;
    },
    onCode: (sym, code) => {
      rec
        .begin({ zh: `'${sym}' → ${code}`, en: `'${sym}' -> ${code}` })
        .setMap([{ key: sym, value: code, role: 'final' as BarRole }])
        .commit();
    },
  };
  const { codes } = shannonFano(symbols, hooks);
  const encoded = encodeWith(text, codes);

  rec
    .begin({
      zh: `完成：「${text}」→ ${encoded.length} 位`,
      en: `Done: "${text}" -> ${encoded.length} bits`,
    })
    .setMap([
      {
        key: '编码',
        value: encoded.length > 40 ? encoded.slice(0, 40) + '...' : encoded,
        role: 'final' as BarRole,
      },
      { key: '位数', value: String(encoded.length), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
