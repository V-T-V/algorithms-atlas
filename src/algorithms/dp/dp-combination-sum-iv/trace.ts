// =============================================================================
// 组合总和 IV · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { combinationSum4, type CombinationSumIVHooks } from './impl.ts';

export const DEFAULT_NUMS = [1, 2, 3];
export const DEFAULT_TARGET = 4;

export function buildTrace(
  nums: readonly number[] = DEFAULT_NUMS,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const dp: number[] = new Array<number>(target + 1).fill(0);
  dp[0] = 1;
  let cur = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = dp.map((_, j) =>
      j === cur
        ? 'compare'
        : j === target && ans > 0
          ? 'final'
          : dp[j]! > 0
            ? 'frontier'
            : 'default',
    );
    rec
      .begin(note)
      .setArray(dp, roles, [{ index: cur < 0 ? 0 : cur, label: 'j' }])
      .setAux([{ label: 'dp', value: dp.map((v) => `${v}`).join(' '), role: 'frontier' }])
      .commit();
  };

  snap({
    zh: `nums=[${nums.join(', ')}] target=${target}`,
    en: `nums=[${nums.join(', ')}] target=${target}`,
  });

  const hooks: CombinationSumIVHooks = {
    onFill: (j, val) => {
      dp[j] = val;
      cur = j;
      snap({ zh: `dp[${j}] = ${val}`, en: `dp[${j}] = ${val}` });
    },
    onResult: (t) => {
      ans = t;
      cur = -1;
      snap({ zh: `排列数 = ${t}`, en: `Permutations = ${t}` });
    },
  };

  combinationSum4(nums, target, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(nums.map((x) => ({ value: x, role: 'final' as BarRole })))
    .setAux([{ label: '排列数 / perms', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
