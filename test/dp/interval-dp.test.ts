import { test } from 'node:test';
import assert from 'node:assert/strict';
import { intervalDp } from '../../src/algorithms/dp/interval-dp/impl.ts';

/** 校验：由 split 回溯出的合并顺序确实产生 minCost。 */
function reconstructCost(stones: number[], split: number[][]): number {
  const prefix = new Array<number>(stones.length + 1).fill(0);
  for (let i = 0; i < stones.length; i++) prefix[i + 1] = prefix[i]! + stones[i]!;
  const sum = (i: number, j: number): number => prefix[j + 1]! - prefix[i]!;
  const rec = (i: number, j: number): number => {
    if (i === j) return 0;
    const k = split[i]![j]!;
    return rec(i, k) + rec(k + 1, j) + sum(i, j);
  };
  return rec(0, stones.length - 1);
}

test('interval-dp 经典 [1,2,3,4] 最小代价', () => {
  assert.equal(intervalDp([1, 2, 3, 4]).minCost, 19);
});

test('interval-dp 单堆', () => {
  assert.equal(intervalDp([5]).minCost, 0);
  assert.equal(intervalDp([]).minCost, 0);
});

test('interval-dp 两堆', () => {
  assert.equal(intervalDp([3, 4]).minCost, 7);
});

test('interval-dp dp 表对角线为 0', () => {
  const r = intervalDp([3, 1, 2]);
  for (let i = 0; i < 3; i++) assert.equal(r.dp[i]![i], 0);
});

test('interval-dp 回溯一致', () => {
  const stones = [4, 2, 3, 1, 5];
  const r = intervalDp(stones);
  assert.equal(reconstructCost(stones, r.split), r.minCost);
});

test('interval-dp 与朴素分治一致', () => {
  const stones = [3, 4, 5, 1, 2];
  const r = intervalDp(stones);
  // 朴素递归 O(2^n) 求最小
  const prefix = new Array<number>(stones.length + 1).fill(0);
  for (let i = 0; i < stones.length; i++) prefix[i + 1] = prefix[i]! + stones[i]!;
  const sum = (i: number, j: number): number => prefix[j + 1]! - prefix[i]!;
  const naive = (i: number, j: number): number => {
    if (i === j) return 0;
    let best = Infinity;
    for (let k = i; k < j; k++) best = Math.min(best, naive(i, k) + naive(k + 1, j));
    return best + sum(i, j);
  };
  assert.equal(r.minCost, naive(0, stones.length - 1));
});

test('interval-dp 钩子被调用', () => {
  let intervals = 0;
  let splits = 0;
  let doneCost = -1;
  intervalDp([1, 2, 3], {
    onEnterInterval: () => intervals++,
    onTrySplit: () => splits++,
    onDone: (c) => {
      doneCost = c;
    },
  });
  assert.ok(intervals >= 1, '至少进入一个区间');
  assert.ok(splits >= 1, '至少尝试一个分割点');
  assert.equal(doneCost, 9); // [1,2,3]: (1+2)+3 = 6 + ... 实际 1+2=3(c3); 3+3=6(c6) 总9
});
