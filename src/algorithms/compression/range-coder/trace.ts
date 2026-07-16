// 范围编码 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rangeCoder, buildModel, type RangeCoderHooks } from './impl.ts';

export interface RcInput {
  symbols: number[];
  freqs: number[];
}

export const DEFAULT_INPUT: RcInput = { symbols: [0, 1, 0, 2, 0, 1], freqs: [3, 2, 1] };

/** 录制演示帧序列。 */
export function buildTrace(input: RcInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { symbols, freqs } = input;
  const model = buildModel(freqs);

  rec
    .begin({
      zh: `${symbols.length} 个符号，${freqs.length} 种`,
      en: `${symbols.length} symbols, ${freqs.length} types`,
    })
    .setBars(freqs.map((f) => ({ value: f, role: 'default' as BarRole })))
    .setAux([{ label: '总频数', value: String(model.total), role: 'pivot' as BarRole }])
    .commit();

  const hooks: RangeCoderHooks = {
    onEncode: (sym) => {
      rec
        .begin({ zh: `编码符号 ${sym}`, en: `Encode symbol ${sym}` })
        .setBars(
          symbols.map((s, i) => ({
            value: s,
            role: (i === sym ? 'compare' : 'default') as BarRole,
          })),
        )
        .commit();
    },
  };
  const { bytes } = rangeCoder(symbols, model, hooks);

  rec
    .begin({ zh: `完成：${bytes.length} 字节`, en: `Done: ${bytes.length} bytes` })
    .setBars(bytes.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setMap([{ key: '字节数', value: String(bytes.length), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
