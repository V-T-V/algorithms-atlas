// =============================================================================
// 划分DP · 录制帧序列
// 用单行 grid 展示 dp[w]（能否凑出和 w）。每处理一件物品刷新一次。
// 当前可达格标 'frontier'，已稳定（dp[target]）标 'final'，本件相关标 'compare'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { partition, type PartitionHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 5, 11, 5];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nums = input;
  const _n = nums.length;
  const total = nums.reduce((a, b) => a + b, 0);
  const even = total % 2 === 0;
  const target = even ? total / 2 : 0;

  const dp: boolean[] = new Array<boolean>(Math.max(target, 0) + 1).fill(false);
  if (target >= 0) dp[0] = true;
  let curW = -1;
  let curI = -1;
  let result = false;

  const renderGrid = (): Cell[][] => {
    if (!even) {
      return [[{ v: `总和 ${total} 为奇数，无法等分`, role: 'warn' }]];
    }
    const header: Cell[] = [{ v: '和 w', role: 'default' }];
    for (let w = 0; w <= target; w++) header.push({ v: w, role: 'pivot' });
    const row: Cell[] = [{ v: 'dp[w]', role: 'pivot' }];
    for (let w = 0; w <= target; w++) {
      let role: BarRole = 'default';
      if (w === target) role = result ? 'final' : 'frontier';
      else if (curW === w) role = 'compare';
      row.push({ v: dp[w]! ? 'T' : '·', role });
    }
    return [header, row];
  };

  const auxItems = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: '当前物品 / item', value: curI >= 0 ? `${nums[curI]!}` : '—', role: 'compare' },
    { label: '目标和 / target', value: String(target), role: 'frontier' },
  ];

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).setAux(auxItems()).commit();
  };

  snap({
    zh: `总和 = ${total}${even ? `，目标子集和 = ${target}` : '（奇数，不可等分）'}`,
    en: `Total = ${total}${even ? `, target subset-sum = ${target}` : ' (odd, cannot split)'}`,
  });

  if (!even) {
    return rec.build();
  }

  const hooks: PartitionHooks = {
    onItem: (i) => {
      curI = i;
    },
    onFillCell: (w) => {
      dp[w] = true;
      curW = w;
      snap({
        zh: `处理物品 ${nums[curI]!}：凑出和 ${w}（dp[${w}] = true）`,
        en: `Item ${nums[curI]!}: reach sum ${w} (dp[${w}] = true)`,
      });
    },
    onDone: (ok) => {
      result = ok;
    },
  };

  partition(nums, hooks);

  curW = -1;
  curI = -1;
  rec
    .begin({
      zh: result ? `可等分（凑出 ${target}）` : `不可等分`,
      en: result ? `Can split (sum ${target})` : `Cannot split`,
    })
    .setGrid(renderGrid())
    .setAux([{ label: '结果 / result', value: result ? 'true' : 'false', role: 'final' }])
    .commit();

  return rec.build();
}
