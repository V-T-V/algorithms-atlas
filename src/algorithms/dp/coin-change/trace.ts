// =============================================================================
// 零钱兑换 · 录制帧序列
// 用一维数组（setArray）展示 dp[0..amount]：当前处理的金额用指针标注，
// 不可达用 ∞ / 'warn'，回溯选取的硬币标 'final'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { coinChange, type CoinChangeHooks } from './impl.ts';

export const DEFAULT_INPUT: { coins: number[]; amount: number } = {
  coins: [1, 2, 5],
  amount: 11,
};

/** 录制演示帧序列。 */
export function buildTrace(input: { coins: number[]; amount: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { coins, amount } = input;

  if (amount < 0) {
    rec.begin({ zh: '金额为负', en: 'Negative amount' }).commit();
    return rec.build();
  }

  // dp[0..amount]，Infinity 表示不可达
  const dp: number[] = new Array<number>(amount + 1).fill(Infinity);
  dp[0] = 0;
  let curI = -1;
  let curCoin = -1;
  const pickedIdx = new Set<number>(); // 回溯选中的金额下标

  /** 渲染：把 dp 转为 bars 兼容的展示（∞ 用 -1 占位并标 warn）。 */
  const renderArray = (note: { zh: string; en: string }): void => {
    const values: number[] = dp.map((v) => (v === Infinity ? 0 : v));
    const roles: BarRole[] = dp.map((v, i) => {
      if (pickedIdx.has(i)) return 'final';
      if (v === Infinity) return 'warn';
      if (i === curI) return 'compare';
      return 'default';
    });
    const pointers: Array<{ index: number; label: string }> = [];
    if (curI >= 0) pointers.push({ index: curI, label: `i=${curI}` });
    if (curCoin > 0 && curI - curCoin >= 0) {
      pointers.push({ index: curI - curCoin, label: `i-${curCoin}` });
    }
    rec
      .begin(note)
      .setArray(values, roles, pointers)
      .setAux([
        { label: '面额', value: `[${coins.join(', ')}]`, role: 'default' },
        { label: '目标', value: String(amount), role: 'pivot' },
      ])
      .commit();
  };

  renderArray({
    zh: `面额 [${coins.join(', ')}]，凑 ${amount}`,
    en: `Coins [${coins.join(', ')}], target ${amount}`,
  });

  const hooks: CoinChangeHooks = {
    onTryCoin: (i, coin, prev, candidate, better) => {
      curI = i;
      curCoin = coin;
      renderArray(
        better
          ? {
              zh: `i=${i}：用硬币 ${coin}（dp[${i - coin}]=${prev === Infinity ? '∞' : prev}）→ 候选 ${candidate} ✓ 更优`,
              en: `i=${i}: coin ${coin} (dp[${i - coin}]=${prev === Infinity ? '∞' : prev}) → candidate ${candidate} ✓ better`,
            }
          : {
              zh: `i=${i}：用硬币 ${coin}（dp[${i - coin}]=${prev === Infinity ? '∞' : prev}）→ 候选 ${candidate}，未更优`,
              en: `i=${i}: coin ${coin} (dp[${i - coin}]=${prev === Infinity ? '∞' : prev}) → candidate ${candidate}, not better`,
            },
      );
    },
    onSetValue: (i, value) => {
      dp[i] = value;
      curCoin = -1;
      curI = i;
      renderArray({
        zh: `dp[${i}] = ${value === Infinity ? '∞（不可达）' : value}`,
        en: `dp[${i}] = ${value === Infinity ? '∞ (unreachable)' : value}`,
      });
    },
    onPickCoin: (_coin, from) => {
      pickedIdx.add(from);
      curI = -1;
      curCoin = -1;
      renderArray({ zh: `回溯：从 ${from} 取硬币`, en: `Backtrack: coin from ${from}` });
    },
  };

  const result = coinChange(coins, amount, hooks);

  // 终态
  curI = -1;
  curCoin = -1;
  pickedIdx.clear();
  pickedIdx.add(0);
  pickedIdx.add(amount);
  rec
    .begin({
      zh:
        result.count === -1
          ? `无法凑出 ${amount}`
          : `最少 ${result.count} 枚：[${result.coins?.join(', ')}]`,
      en:
        result.count === -1
          ? `Cannot make ${amount}`
          : `Min ${result.count} coins: [${result.coins?.join(', ')}]`,
    })
    .setArray(
      dp.map((v) => (v === Infinity ? 0 : v)),
      dp.map((v) => (v === Infinity ? 'warn' : 'final') as BarRole),
      [],
    )
    .setAux([
      { label: '面额', value: `[${coins.join(', ')}]`, role: 'default' },
      {
        label: '最少',
        value: result.count === -1 ? '不可达' : String(result.count),
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
