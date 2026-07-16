// 算术编码 · 录制帧序列
// 用 setMap 展示累积分布 + setAux 展示区间 [lo,hi] 逐步缩小。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { arithmeticEncode, buildCDF, type ArithmeticHooks, type FreqMap } from './impl.ts';

export const DEFAULT_FREQ: FreqMap = { A: 3, B: 2, C: 1 };
export const DEFAULT_MESSAGE = 'ABC';

export function buildTrace(
  message: string = DEFAULT_MESSAGE,
  freq: FreqMap = DEFAULT_FREQ,
): Frame[] {
  const rec = new TraceRecorder();
  const cdf = buildCDF(freq);

  const snapshot = (note: { zh: string; en: string }, lo: number, hi: number) => {
    rec
      .begin(note)
      .setMap(
        cdf.map((e) => ({
          key: e.ch,
          value: `[${e.lo.toFixed(3)}, ${e.hi.toFixed(3)})`,
          role: 'compare' as BarRole,
        })),
      )
      .setAux([
        { label: '区间下界 lo', value: lo.toExponential(6), role: 'pivot' as BarRole },
        { label: '区间上界 hi', value: hi.toExponential(6), role: 'pivot' as BarRole },
        { label: '区间宽度', value: (hi - lo).toExponential(6), role: 'final' as BarRole },
      ])
      .commit();
  };

  snapshot(
    { zh: `初始区间 [0, 1)，编码 "${message}"`, en: `Initial [0,1), encoding "${message}"` },
    0,
    1,
  );

  const hooks: ArithmeticHooks = {
    onEncodeSymbol: (ch, lo, hi) => {
      snapshot(
        {
          zh: `编码 '${ch}'：区间缩小为 [${lo.toExponential(3)}, ${hi.toExponential(3)})`,
          en: `Encode '${ch}': range → [${lo.toExponential(3)}, ${hi.toExponential(3)})`,
        },
        lo,
        hi,
      );
    },
  };

  const result = arithmeticEncode(message, freq, hooks);

  rec
    .begin({
      zh: `完成：编码值 = ${result.code.toExponential(6)}`,
      en: `Done: code = ${result.code.toExponential(6)}`,
    })
    .setAux([{ label: '编码值', value: result.code.toExponential(8), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
