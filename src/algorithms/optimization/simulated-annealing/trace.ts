// =============================================================================
// 模拟退火 · 录制帧序列
// 用 setBars 展示当前解，setAux 展示温度/能量/迭代。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  simulatedAnnealing,
  adjacentEnergy,
  swapNeighbor,
  mulberry32,
  type SAOptions,
  type SimulatedAnnealingHooks,
} from './impl.ts';

export interface SAInput {
  values: number[];
  seed?: number;
}

export const DEFAULT_INPUT: SAInput = {
  values: [5, 2, 9, 1, 7, 4, 8, 3, 6],
  seed: 7,
};

/** 录制演示帧序列。 */
export function buildTrace(input: SAInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { values, seed = 7 } = input;

  // 通过 neighbor 捕获每步候选解，在 onStep 中据 accept 决定展示谁
  let bestEnergy = adjacentEnergy(values);
  let temp = 0;
  let iter = 0;
  // 当前展示状态（= 内核的 current）。初始等于 values
  let current = [...values];
  let currentEnergy = bestEnergy;
  // 最近一次 neighbor 产出的候选
  let pendingCandidate = [...values];

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(current.map((v) => ({ value: v, role: 'default' as BarRole, label: String(v) })))
      .setAux([
        { label: '迭代 / iter', value: String(iter), role: 'default' as BarRole },
        { label: '温度 / T', value: temp.toFixed(3), role: 'pivot' as BarRole },
        { label: '当前能量', value: currentEnergy.toFixed(2), role: 'compare' as BarRole },
        { label: '最优能量', value: bestEnergy.toFixed(2), role: 'final' as BarRole },
      ])
      .commit();
  };

  snapshot({
    zh: `初始解能量 = ${bestEnergy.toFixed(2)}（目标：最小化相邻差平方和）`,
    en: `Initial energy = ${bestEnergy.toFixed(2)} (minimize sum of squared adjacent diffs)`,
  });

  const options: SAOptions = {
    initialTemp: 100,
    cooling: 0.95,
    minTemp: 0.5,
    maxIterations: 400,
    rng: mulberry32(seed),
  };

  const hooks: SimulatedAnnealingHooks<number[]> = {
    onStep: (i, t, ce, _ne, accept) => {
      iter = i;
      temp = t;
      // 接受则 current 推进到候选；否则保持
      if (accept) {
        current = [...pendingCandidate];
        currentEnergy = _ne;
      } else {
        currentEnergy = ce;
      }
      snapshot(
        accept
          ? _ne < ce
            ? {
                zh: `T=${t.toFixed(2)} 接受更优（${ce.toFixed(1)}→${_ne.toFixed(1)}）`,
                en: `T=${t.toFixed(2)} accept better (${ce.toFixed(1)}->${_ne.toFixed(1)})`,
              }
            : {
                zh: `T=${t.toFixed(2)} 接受更差（${ce.toFixed(1)}→${_ne.toFixed(1)}）`,
                en: `T=${t.toFixed(2)} accept worse (${ce.toFixed(1)}->${_ne.toFixed(1)})`,
              }
          : {
              zh: `T=${t.toFixed(2)} 拒绝（保持 ${ce.toFixed(1)}）`,
              en: `T=${t.toFixed(2)} reject (keep ${ce.toFixed(1)})`,
            },
      );
    },
    onImprove: (_i, _b, be) => {
      bestEnergy = be;
    },
  };

  const wrappedNeighbor = (state: number[], rng: () => number): number[] => {
    const next = swapNeighbor(state, rng);
    pendingCandidate = next;
    return next;
  };

  const result = simulatedAnnealing<number[]>(
    values,
    wrappedNeighbor,
    adjacentEnergy,
    options,
    hooks,
  );

  // 终态：最优解
  const sortedEnergy = adjacentEnergy([...values].sort((a, b) => a - b));
  rec
    .begin({
      zh: `完成：${result.iterations} 步，最优能量 ${bestEnergy.toFixed(2)}（理论最优 ${sortedEnergy.toFixed(2)}）`,
      en: `Done: ${result.iterations} steps, best energy ${bestEnergy.toFixed(2)} (optimal ${sortedEnergy.toFixed(2)})`,
    })
    .setBars(result.best.map((v) => ({ value: v, role: 'final' as BarRole, label: String(v) })))
    .setAux([
      { label: '最优能量', value: bestEnergy.toFixed(2), role: 'final' as BarRole },
      { label: '理论最优', value: sortedEnergy.toFixed(2), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
