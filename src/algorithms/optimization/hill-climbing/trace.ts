// =============================================================================
// 爬山算法 · 录制帧序列
// 可视化：setBars 展示当前解（排列），setAux 展示迭代/当前能量/最优能量。
// roles: 接受移动后高亮被交换的两个位置。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  hillClimbing,
  adjacentEnergy,
  swapNeighbor,
  mulberry32,
  type HCOptions,
  type HillClimbingHooks,
} from './impl.ts';

export interface HCInput {
  values: number[];
  seed?: number;
}

export const DEFAULT_INPUT: HCInput = {
  values: [5, 2, 9, 1, 7, 4, 8, 3, 6],
  seed: 11,
};

/** 录制演示帧序列。 */
export function buildTrace(input: HCInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { values, seed = 11 } = input;

  let bestEnergy = adjacentEnergy(values);
  let iter = 0;
  // 当前展示状态（= 内核的 current）。初始等于 values
  let current = [...values];
  let currentEnergy = bestEnergy;
  // 最近一次接受时本步的候选（neighbor）状态，用于显示移动
  let pendingCandidate: number[] | null = null;
  let movedSwap: [number, number] | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    if (movedSwap) {
      roles[movedSwap[0]] = 'swap';
      roles[movedSwap[1]] = 'swap';
    }
    rec
      .begin(note)
      .setBars(current.map((v, i) => ({ value: v, role: roles[i] ?? 'default', label: String(v) })))
      .setAux([
        { label: '迭代 / iter', value: String(iter), role: 'default' as BarRole },
        { label: '当前能量', value: currentEnergy.toFixed(2), role: 'compare' as BarRole },
        { label: '最优能量', value: bestEnergy.toFixed(2), role: 'final' as BarRole },
      ])
      .commit();
    movedSwap = null;
  };

  snapshot({
    zh: `初始解能量 = ${bestEnergy.toFixed(2)}（目标：最小化相邻差平方和）`,
    en: `Initial energy = ${bestEnergy.toFixed(2)} (minimize sum of squared adjacent diffs)`,
  });

  const options: HCOptions = {
    maxIterations: 200,
    sampleSize: 6,
    rng: mulberry32(seed),
  };

  // 包装 neighbor：捕获本步最终选中的候选解（最陡上升：能量最低的邻居）
  // 注意 neighbor 在采样循环里被多次调用，最后留下的 pendingCandidate 即最优候选
  const wrappedNeighbor = (state: number[], rng: () => number): number[] => {
    // 候选状态；用闭包内的 bestCandidate 跟踪本步最优
    const next = swapNeighbor(state, rng);
    // 记录候选（每次覆盖；最后由内核选出能量最低者，但内核不返回它，
    // 故这里用 pendingCandidate 配合能量比较）
    if (pendingCandidate === null || adjacentEnergy(next) < adjacentEnergy(pendingCandidate)) {
      pendingCandidate = next;
    }
    return next;
  };

  const hooks: HillClimbingHooks<number[]> = {
    onStep: (i, ce, cne, accept) => {
      iter = i;
      if (accept && pendingCandidate) {
        // 计算被交换的下标（current 与 pendingCandidate 差异）
        const diff: number[] = [];
        for (let k = 0; k < current.length; k++) {
          if (current[k]! !== pendingCandidate[k]!) diff.push(k);
        }
        movedSwap = diff.length === 2 ? [diff[0]!, diff[1]!] : null;
        // 推进展示状态到候选
        current = [...pendingCandidate];
        currentEnergy = cne;
        snapshot({
          zh: `迭代 ${i}：接受更优邻居（能量 ${ce.toFixed(2)} → ${cne.toFixed(2)}）`,
          en: `Iter ${i}: accept better neighbor (energy ${ce.toFixed(2)} → ${cne.toFixed(2)})`,
        });
      } else {
        snapshot({
          zh: `迭代 ${i}：无更优邻居 → 到达局部最优（能量 ${ce.toFixed(2)}）`,
          en: `Iter ${i}: no better neighbor → local optimum (energy ${ce.toFixed(2)})`,
        });
      }
      pendingCandidate = null;
    },
    onImprove: (_i, _b, be) => {
      bestEnergy = be;
    },
  };

  const result = hillClimbing<number[]>(values, wrappedNeighbor, adjacentEnergy, options, hooks);

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
      { label: '迭代步数', value: String(result.iterations), role: 'default' as BarRole },
    ])
    .commit();

  return rec.build();
}
