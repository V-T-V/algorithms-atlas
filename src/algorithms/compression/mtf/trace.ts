// MTF · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mtf, type MtfHooks } from './impl.ts';

export interface MtfInput {
  symbols: number[];
}

export const DEFAULT_INPUT: MtfInput = { symbols: [66, 65, 78, 65, 78, 65] }; // BANANA

/** 录制演示帧序列。 */
export function buildTrace(input: MtfInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { symbols } = input;

  rec
    .begin({ zh: `输入符号 [${symbols.join(',')}]`, en: `Input symbols [${symbols.join(',')}]` })
    .setBars(symbols.map((s) => ({ value: s, role: 'default' as BarRole })))
    .commit();

  const hooks: MtfHooks = {
    onEncode: (sym, idx) => {
      rec
        .begin({
          zh: `符号 ${sym} → 索引 ${idx}，并移到表头`,
          en: `Symbol ${sym} -> index ${idx}, move to front`,
        })
        .setBars([{ value: idx, role: 'compare' as BarRole }])
        .commit();
    },
  };
  const { encoded } = mtf(symbols, 256, hooks);

  rec
    .begin({ zh: `完成：编码 [${encoded.join(',')}]`, en: `Done: encoded [${encoded.join(',')}]` })
    .setBars(encoded.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setMap([{ key: 'MTF', value: encoded.join(','), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
