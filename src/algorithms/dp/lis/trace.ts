// =============================================================================
// 最长递增子序列 LIS · 录制帧序列
// 用 1 行 grid 展示 dp[]：当前考察格标 'compare'，最终答案路径标 'final'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lis, type LisHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  // dp 长度表（逐格填入），未填为 undefined
  const dp: Array<number | undefined> = new Array(n).fill(undefined);
  let curI = -1; // 当前正在填的下标
  let curJ = -1; // 当前回看的前驱
  const answerIdx = new Set<number>(); // 回溯出的答案下标

  /** 渲染一帧：dp 值（未填显示 ·），当前格 compare，答案路径 final。 */
  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<string, BarRole> = {};
    if (curI >= 0) roles[`0,${curI}`] = 'compare';
    if (curJ >= 0) roles[`0,${curJ}`] = 'frontier';
    for (const k of answerIdx) roles[`0,${k}`] = 'final';
    const row = dp.map((d) => (d === undefined ? '·' : d));
    rec
      .begin(note)
      .setGrid(rec.gridFrom([row], roles))
      .setAux([{ label: 'arr', value: input.join('  '), role: 'default' }])
      .commit();
  };

  snapshot({ zh: `输入数组：${input.join(', ')}`, en: `Input array: ${input.join(', ')}` });

  const hooks: LisHooks = {
    onConsider: (i, j) => {
      curI = i;
      curJ = j;
      snapshot({
        zh: `填 dp[${i}]：回看前驱 j=${j}（arr[${j}]=${input[j]}）`,
        en: `Fill dp[${i}]: look back at j=${j} (arr[${j}]=${input[j]})`,
      });
    },
    onFillCell: (i, len) => {
      dp[i] = len;
      curI = i;
      curJ = -1;
      snapshot({
        zh: `dp[${i}] = ${len}（以 arr[${i}]=${input[i]} 结尾的最长长度）`,
        en: `dp[${i}] = ${len} (best length ending at arr[${i}]=${input[i]})`,
      });
    },
    onBacktrack: (i) => {
      answerIdx.add(i);
      curI = -1;
      curJ = -1;
      snapshot({
        zh: `回溯：arr[${i}]=${input[i]} 在答案路径上`,
        en: `Backtrack: arr[${i}]=${input[i]} is on the answer path`,
      });
    },
  };

  const result = lis(input, hooks);

  // 终态
  const roles: Record<string, BarRole> = {};
  for (const k of answerIdx) roles[`0,${k}`] = 'final';
  rec
    .begin({ zh: `LIS = [${result.join(', ')}]`, en: `LIS = [${result.join(', ')}]` })
    .setGrid(rec.gridFrom([dp], roles))
    .setAux([{ label: 'LIS', value: `[${result.join(', ')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
