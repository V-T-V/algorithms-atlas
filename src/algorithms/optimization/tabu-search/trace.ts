// =============================================================================
// 禁忌搜索 · 录制帧序列
// 用 setBars 展示当前解（排列），setAux 展示能量 / 禁忌表 / 迭代。
// 固定种子保证可复现。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  tabuSearch,
  adjacentEnergy,
  swapNeighborhood,
  mulberry32,
  type TabuOptions,
  type TabuSearchHooks,
} from './impl.ts';

export interface TabuInput {
  values: number[];
  seed?: number;
}

export const DEFAULT_INPUT: TabuInput = {
  values: [5, 2, 9, 1, 7, 4, 8, 3, 6],
  seed: 7,
};

/** 录制演示帧序列。 */
export function buildTrace(input: TabuInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { values, seed = 7 } = input;

  let bestEnergy = adjacentEnergy(values);
  let iter = 0;
  let current = [...values];
  let currentEnergy = bestEnergy;
  // 最近禁忌项（最近 tabuTenure 步的 move 标识）
  let recentTabu: string[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(current.map((v) => ({ value: v, role: 'default' as BarRole, label: String(v) })))
      .setAux([
        { label: '迭代 / iter', value: String(iter), role: 'default' as BarRole },
        { label: '当前能量', value: currentEnergy.toFixed(2), role: 'compare' as BarRole },
        { label: '最优能量', value: bestEnergy.toFixed(2), role: 'final' as BarRole },
        { label: '禁忌表', value: recentTabu.join(' | ') || '∅', role: 'pivot' as BarRole },
      ])
      .commit();
  };

  snapshot({
    zh: `初始解能量 = ${bestEnergy.toFixed(2)}（目标：最小化相邻差平方和）`,
    en: `Initial energy = ${bestEnergy.toFixed(2)} (minimize sum of squared adjacent diffs)`,
  });

  const options: TabuOptions = {
    maxIterations: 60,
    tabuTenure: 5,
    rng: mulberry32(seed),
  };

  // 维护一个滑动窗口模拟禁忌表展示
  const tabuFifo: string[] = [];

  const hooks: TabuSearchHooks<number[]> = {
    onStep: (i, cur, ce, _be, _accepted) => {
      iter = i;
      current = [...cur];
      currentEnergy = ce;
      recentTabu = [...tabuFifo];
      snapshot({
        zh: `第 ${i + 1} 轮：移动到能量 ${ce.toFixed(2)}${ce < _be ? '（更新最优）' : ''}`,
        en: `Iter ${i + 1}: move to energy ${ce.toFixed(2)}${ce < _be ? ' (new best)' : ''}`,
      });
    },
    onAccept: (_i, move, _e) => {
      tabuFifo.push(String(move));
      while (tabuFifo.length > options.tabuTenure) tabuFifo.shift();
    },
    onImprove: (_i, _b, be) => {
      bestEnergy = be;
    },
  };

  const result = tabuSearch<number[]>(values, swapNeighborhood, adjacentEnergy, options, hooks);

  // 终态：最优解
  const sortedEnergy = adjacentEnergy([...values].sort((a, b) => a - b));
  rec
    .begin({
      zh: `完成：${result.iterations} 轮，最优能量 ${bestEnergy.toFixed(2)}（理论最优 ${sortedEnergy.toFixed(2)}）`,
      en: `Done: ${result.iterations} iters, best energy ${bestEnergy.toFixed(2)} (optimal ${sortedEnergy.toFixed(2)})`,
    })
    .setBars(result.best.map((v) => ({ value: v, role: 'final' as BarRole, label: String(v) })))
    .setAux([
      { label: '最优能量', value: bestEnergy.toFixed(2), role: 'final' as BarRole },
      { label: '理论最优', value: sortedEnergy.toFixed(2), role: 'pivot' as BarRole },
      { label: '迭代轮数', value: String(result.iterations), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
