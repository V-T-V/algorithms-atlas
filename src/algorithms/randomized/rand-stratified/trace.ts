// 分层采样 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stratifiedSample1D, stratifiedIntegrate } from './impl.ts';

export const DEFAULT_INPUT = { n: 8 };

export function buildTrace(input: { n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `分层采样（${input.n} 层）`, en: `Stratified sampling (${input.n} strata)` })
    .setAux([{ label: '层', value: String(input.n), role: 'pivot' }])
    .commit();

  const samples = stratifiedSample1D(input.n, undefined, {
    onStratum: (i, lo, hi, x) => {
      rec
        .begin({
          zh: `层 ${i} [${lo.toFixed(2)},${hi.toFixed(2)}) → x=${x.toFixed(3)}`,
          en: `stratum ${i} [${lo.toFixed(2)},${hi.toFixed(2)}) → x=${x.toFixed(3)}`,
        })
        .setBars([{ value: Math.round(x * 100), role: 'frontier' as BarRole }])
        .setAux([{ label: `层${i}`, value: x.toFixed(3), role: 'final' as BarRole }])
        .commit();
    },
  });

  // 估计 ∫₀¹ x dx = 0.5
  const est = stratifiedIntegrate((x) => x, input.n);
  rec
    .begin({
      zh: `∫₀¹ x dx ≈ ${est.toFixed(3)}（理论 0.5）`,
      en: `∫₀¹ x dx ≈ ${est.toFixed(3)} (theory 0.5)`,
    })
    .setBars(samples.map((x) => ({ value: Math.round(x * 100), role: 'sorted' as BarRole })))
    .setAux([{ label: '估计', value: est.toFixed(3), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
