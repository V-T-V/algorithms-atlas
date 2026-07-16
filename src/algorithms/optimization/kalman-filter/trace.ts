// =============================================================================
// 卡尔曼滤波 · 录制帧序列
// setBars 展示每步真值/观测/估计；setAux 展示增益与速度估计。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kalmanFilter, demoData, type KalmanHooks } from './impl.ts';

export const DEFAULT_INPUT = { useDemo: true };

/** 录制演示帧序列。 */
export function buildTrace(_input: { useDemo?: boolean } = {}): Frame[] {
  const rec = new TraceRecorder();
  const { F, H, Q, R, init, truth, observations } = demoData();

  // 真值/观测总览
  rec
    .begin({
      zh: `跟踪 ${observations.length} 步匀速运动`,
      en: `Track ${observations.length} steps of constant-velocity motion`,
    })
    .setBars(
      truth.map((t, i) => ({
        value: t,
        role: 'compare' as BarRole,
        label: `t=${i} obs=${observations[i]!.toFixed(1)}`,
      })),
    )
    .commit();

  let stepNo = 0;
  const estimates: number[] = [];

  const hooks: KalmanHooks = {
    onStep: (step) => {
      stepNo = step.k;
      estimates.push(step.updatedMean[0]!);
      rec
        .begin({
          zh: `第 ${step.k} 步：观测 ${step.measurement.toFixed(2)}，预测 ${step.predictedMeasurement.toFixed(2)}，估计 ${step.updatedMean[0]!.toFixed(2)}`,
          en: `Step ${step.k}: obs ${step.measurement.toFixed(2)}, pred ${step.predictedMeasurement.toFixed(2)}, est ${step.updatedMean[0]!.toFixed(2)}`,
        })
        .setBars([
          { value: truth[step.k - 1]!, role: 'compare' as BarRole, label: '真值' },
          { value: step.measurement, role: 'warn' as BarRole, label: '观测' },
          { value: step.updatedMean[0]!, role: 'final' as BarRole, label: '估计' },
        ])
        .setAux([
          { label: '位置估计', value: step.updatedMean[0]!.toFixed(3), role: 'final' as BarRole },
          { label: '速度估计', value: step.updatedMean[1]!.toFixed(3), role: 'pivot' as BarRole },
          { label: '增益 K₀', value: step.gain[0]!.toFixed(3), role: 'frontier' as BarRole },
        ])
        .commit();
    },
  };

  kalmanFilter(observations, { F, H, Q, R, init }, hooks);

  // 终态：估计轨迹
  rec
    .begin({ zh: `完成 ${stepNo} 步`, en: `Done ${stepNo} steps` })
    .setBars(
      estimates.map((e, i) => ({
        value: e,
        role: 'final' as BarRole,
        label: `${i}: truth=${truth[i]}`,
      })),
    )
    .commit();

  return rec.build();
}
