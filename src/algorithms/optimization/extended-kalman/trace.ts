// =============================================================================
// 扩展卡尔曼滤波 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { extendedKalmanFilter, demoData, type EKFHooks } from './impl.ts';

export const DEFAULT_INPUT = { useDemo: true };

export function buildTrace(_input: { useDemo?: boolean } = {}): Frame[] {
  const rec = new TraceRecorder();
  const { options, truth, observations } = demoData();

  rec
    .begin({
      zh: `EKF 跟踪 ${observations.length} 步（非线性距离观测）`,
      en: `EKF track ${observations.length} steps (nonlinear range obs)`,
    })
    .setBars(observations.map((o, i) => ({ value: o, role: 'warn' as BarRole, label: `t${i}` })))
    .commit();

  let stepNo = 0;
  const positions: Array<{ x: number; y: number }> = [];

  const hooks: EKFHooks = {
    onStep: (step) => {
      stepNo = step.k;
      positions.push({ x: step.updatedMean[0]!, y: step.updatedMean[1]! });
      const t = truth[step.k - 1]!;
      rec
        .begin({
          zh: `第 ${step.k} 步：观测距离 ${step.measurement.toFixed(2)}，估计位置 (${step.updatedMean[0]!.toFixed(2)}, ${step.updatedMean[1]!.toFixed(2)})`,
          en: `Step ${step.k}: range obs ${step.measurement.toFixed(2)}, est pos (${step.updatedMean[0]!.toFixed(2)}, ${step.updatedMean[1]!.toFixed(2)})`,
        })
        .setBars([
          { value: t[0]!, role: 'compare' as BarRole, label: '真值 px' },
          { value: step.updatedMean[0]!, role: 'final' as BarRole, label: '估计 px' },
          { value: t[1]!, role: 'pivot' as BarRole, label: '真值 py' },
          { value: step.updatedMean[1]!, role: 'frontier' as BarRole, label: '估计 py' },
        ])
        .setAux([
          { label: '观测距离', value: step.measurement.toFixed(3), role: 'warn' as BarRole },
          {
            label: '预测距离',
            value: step.predictedMeasurement.toFixed(3),
            role: 'compare' as BarRole,
          },
        ])
        .commit();
    },
  };

  extendedKalmanFilter(observations, options, hooks);

  // 终态：位置轨迹
  rec
    .begin({ zh: `完成 ${stepNo} 步`, en: `Done ${stepNo} steps` })
    .setBars(
      positions.map((p, i) => ({
        value: p.x,
        role: 'final' as BarRole,
        label: `${i}:(${p.x.toFixed(1)},${p.y.toFixed(1)})`,
      })),
    )
    .commit();

  return rec.build();
}
