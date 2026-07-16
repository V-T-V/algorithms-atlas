// 重要性采样 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { importanceSample } from './impl.ts';

export const DEFAULT_INPUT = { N: 500, propMean: 2 };

export function buildTrace(input: { N: number; propMean: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `重要性采样（N=${input.N}, q 均值=${input.propMean}）`,
      en: `Importance sampling (N=${input.N}, q mean=${input.propMean})`,
    })
    .setAux([{ label: '目标', value: 'E[x²], x~N(0,1)=1', role: 'pivot' }])
    .commit();

  const weights: number[] = [];
  const hooks = {
    onSample: (x: number, weight: number) => {
      weights.push(weight);
      if (weights.length % 50 === 0) {
        rec
          .begin({
            zh: `已采 ${weights.length}（最近权重 ${weight.toFixed(3)}）`,
            en: `${weights.length} sampled (recent w ${weight.toFixed(3)})`,
          })
          .setBars(
            weights
              .slice(-20)
              .map((w) => ({ value: Math.round(w * 100), role: 'frontier' as BarRole })),
          )
          .commit();
      }
    },
  };

  const result = importanceSample(input.N, input.propMean, 1, undefined, undefined, hooks);

  rec
    .begin({
      zh: `估计 E[x²] = ${result.estimate.toFixed(3)}（理论 1）`,
      en: `Estimate E[x²] = ${result.estimate.toFixed(3)} (theory 1)`,
    })
    .setBars([{ value: Math.round(result.estimate * 100), role: 'final' as BarRole }])
    .setAux([{ label: '方差', value: result.variance.toFixed(3), role: 'frontier' as BarRole }])
    .commit();

  return rec.build();
}
