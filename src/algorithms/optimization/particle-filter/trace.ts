// =============================================================================
// 粒子滤波 · 录制帧序列
// setBars 展示粒子分布直方图；setAux 展示估计/真值/ESS。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { particleFilter, demoData, type PFHooks, type Particle } from './impl.ts';

export const DEFAULT_INPUT = { nParticles: 80, seed: 42 };

export function buildTrace(input: { nParticles?: number; seed?: number } = {}): Frame[] {
  const rec = new TraceRecorder();
  const { nParticles = 80, seed = 42 } = input;
  const { truth, observations, initialState } = demoData();

  // 把粒子分箱成直方图
  const histogram = (particles: Particle[], bins = 12): number[] => {
    const xs = particles.map((p) => p.x);
    const lo = Math.min(...xs, ...truth) - 0.5;
    const hi = Math.max(...xs, ...truth) + 0.5;
    const counts = new Array<number>(bins).fill(0);
    const span = hi - lo || 1;
    for (const x of xs) {
      const b = Math.min(bins - 1, Math.floor(((x - lo) / span) * bins));
      counts[b]!++;
    }
    return counts;
  };

  rec
    .begin({
      zh: `${nParticles} 个粒子跟踪 ${observations.length} 步`,
      en: `${nParticles} particles track ${observations.length} steps`,
    })
    .setBars(
      histogram(
        Array.from({ length: nParticles }, (_, i) => ({
          x: initialState + (i / nParticles) * 2 - 1,
          w: 1 / nParticles,
        })),
      ).map((c, i) => ({ value: c, role: 'frontier' as BarRole, label: `bin${i}` })),
    )
    .commit();

  const hooks: PFHooks = {
    onStep: (step, particles) => {
      const hist = histogram(particles);
      rec
        .begin({
          zh: `第 ${step.k} 步：观测 ${step.measurement.toFixed(2)}，估计 ${step.estimate.toFixed(2)}（ESS ${step.ess.toFixed(0)}）`,
          en: `Step ${step.k}: obs ${step.measurement.toFixed(2)}, est ${step.estimate.toFixed(2)} (ESS ${step.ess.toFixed(0)})`,
        })
        .setBars(
          hist.map((c, i) => ({
            value: c,
            role: (i === Math.floor(hist.length / 2) ? 'swap' : 'compare') as BarRole,
            label: `bin${i}`,
          })),
        )
        .setAux([
          { label: '真值', value: truth[step.k - 1]!.toFixed(2), role: 'compare' as BarRole },
          { label: '估计', value: step.estimate.toFixed(3), role: 'final' as BarRole },
          { label: 'ESS', value: step.ess.toFixed(0), role: 'pivot' as BarRole },
        ])
        .commit();
    },
  };

  const result = particleFilter(observations, initialState, { nParticles, seed }, hooks);

  // 终态：估计轨迹 vs 真值
  rec
    .begin({ zh: `完成：估计轨迹`, en: `Done: estimate trajectory` })
    .setBars(
      result.estimates.map((e, i) => ({
        value: e,
        role: 'final' as BarRole,
        label: `t${i}:${truth[i]}`,
      })),
    )
    .commit();

  return rec.build();
}
