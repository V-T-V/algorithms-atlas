// 对偶变量法 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { antitheticIntegrate, crudeMonteCarlo } from './impl.ts';

export const DEFAULT_INPUT = { N: 50 };

export function buildTrace(input: { N: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: number) => x * x; // ∫₀¹ x² dx = 1/3

  rec
    .begin({ zh: `对偶变量法（${input.N} 对）`, en: `Antithetic variates (${input.N} pairs)` })
    .setAux([{ label: '目标', value: '∫x²=1/3', role: 'pivot' }])
    .commit();

  let pairIdx = 0;
  const hooks = {
    onPair: (u: number, anti: number, fU: number, fAnti: number, avg: number) => {
      pairIdx++;
      if (pairIdx % 10 === 0) {
        rec
          .begin({
            zh: `对 ${pairIdx}：u=${u.toFixed(2)} 1-u=${anti.toFixed(2)} 平均=${avg.toFixed(3)}`,
            en: `pair ${pairIdx}: u=${u.toFixed(2)} 1-u=${anti.toFixed(2)} avg=${avg.toFixed(3)}`,
          })
          .setBars([
            { value: Math.round(fU * 100), role: 'compare' as BarRole },
            { value: Math.round(fAnti * 100), role: 'frontier' as BarRole },
          ])
          .commit();
      }
    },
  };

  const result = antitheticIntegrate(f, input.N, undefined, hooks);
  const crude = crudeMonteCarlo(f, input.N);

  rec
    .begin({
      zh: `对偶估计 ${result.estimate.toFixed(3)}（方差 ${result.variance.toExponential(2)}）vs 粗 MC 方差 ${crude.variance.toExponential(2)}`,
      en: `Antithetic ${result.estimate.toFixed(3)} (var ${result.variance.toExponential(2)}) vs crude var ${crude.variance.toExponential(2)}`,
    })
    .setBars([
      { value: Math.round(result.variance * 1e6), role: 'final' as BarRole },
      { value: Math.round(crude.variance * 1e6), role: 'warn' as BarRole },
    ])
    .setAux([
      { label: '对偶方差', value: result.variance.toExponential(2), role: 'final' as BarRole },
      { label: '粗MC方差', value: crude.variance.toExponential(2), role: 'warn' as BarRole },
    ])
    .commit();

  return rec.build();
}
