// =============================================================================
// 子集和 · 录制帧序列
// 用单行 grid 展示 dp[w]（能否凑出和 w）。每处理一件物品刷新一次。
// 当前可达格标 'frontier'，target 标 'final'，回溯选中物品标 'pivot'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { subsetSum, type SubsetSumHooks } from './impl.ts';

export const DEFAULT_INPUT: { nums: number[]; target: number } = {
  nums: [3, 34, 4, 12, 5, 2],
  target: 9,
};

/** 录制演示帧序列。 */
export function buildTrace(input: { nums: number[]; target: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { nums, target } = input;
  const _n = nums.length;

  const dp: boolean[] = new Array<boolean>(target + 1).fill(false);
  dp[0] = true;
  let curW = -1;
  let curI = -1;
  let found = false;
  const chosenSet = new Set<number>();

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [{ v: '和 w', role: 'default' }];
    for (let w = 0; w <= target; w++) header.push({ v: w, role: 'pivot' });
    const row: Cell[] = [{ v: 'dp[w]', role: 'pivot' }];
    for (let w = 0; w <= target; w++) {
      let role: BarRole = 'default';
      if (w === target) role = found ? 'final' : 'frontier';
      else if (curW === w) role = 'compare';
      row.push({ v: dp[w]! ? 'T' : '·', role });
    }
    return [header, row];
  };

  const auxItems = (): Array<{ label: string; value: string; role?: BarRole }> =>
    nums.map((x, idx) => ({
      label: `#${idx}`,
      value: String(x),
      role: chosenSet.has(idx) ? 'final' : curI === idx ? 'compare' : 'default',
    }));

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).setAux(auxItems()).commit();
  };

  snap({
    zh: `目标和 = ${target}，物品 [${nums.join(', ')}]`,
    en: `Target = ${target}, items [${nums.join(', ')}]`,
  });

  const hooks: SubsetSumHooks = {
    onItem: (i) => {
      curI = i;
    },
    onFillCell: (w) => {
      dp[w] = true;
      curW = w;
      snap({
        zh: `物品 ${nums[curI]!}：新达和 ${w}（dp[${w}] = true）`,
        en: `Item ${nums[curI]!}: reach sum ${w} (dp[${w}] = true)`,
      });
    },
    onBacktrack: (i) => {
      chosenSet.add(i);
      curW = -1;
      curI = i;
      snap({
        zh: `回溯：物品 ${i}（值 ${nums[i]!}）被选入`,
        en: `Backtrack: item ${i} (value ${nums[i]!}) chosen`,
      });
    },
    onDone: (ok) => {
      found = ok;
    },
  };

  const result = subsetSum(nums, target, hooks);

  curW = -1;
  curI = -1;
  const sum = result ? result.reduce((a, idx) => a + nums[idx]!, 0) : 0;
  rec
    .begin({
      zh: result ? `找到子集 [${result.map((k) => k).join(', ')}] 和 = ${sum}` : '无可行子集',
      en: result ? `Found subset [${result.join(', ')}], sum = ${sum}` : 'No feasible subset',
    })
    .setGrid(renderGrid())
    .setAux(auxItems())
    .commit();

  return rec.build();
}
