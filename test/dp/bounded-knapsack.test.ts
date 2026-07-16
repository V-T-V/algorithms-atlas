import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  boundedKnapsack,
  type BoundedItem,
} from '../../src/algorithms/dp/bounded-knapsack/impl.ts';

// 暴力：把每件展开成 0/1，跑标准 0/1 背包。
function brute(items: BoundedItem[], capacity: number): number {
  const dp = new Array<number>(capacity + 1).fill(0);
  for (const it of items) {
    for (let c = 0; c < it.count; c++) {
      for (let w = capacity; w >= it.weight; w--) {
        dp[w] = Math.max(dp[w]!, dp[w - it.weight]! + it.value);
      }
    }
  }
  return dp[capacity]!;
}

test('bounded-knapsack 基本行为', () => {
  assert.equal(boundedKnapsack([], 10), 0);
  assert.equal(boundedKnapsack([{ weight: 2, value: 3, count: 2 }], 0), 0);
  // 单种物品
  assert.equal(boundedKnapsack([{ weight: 2, value: 3, count: 5 }], 4), 6); // 取 2 件
  assert.equal(boundedKnapsack([{ weight: 2, value: 3, count: 1 }], 4), 3); // 只能取 1 件
});

test('bounded-knapsack 经典用例', () => {
  const items: BoundedItem[] = [
    { weight: 2, value: 3, count: 4 },
    { weight: 3, value: 4, count: 2 },
    { weight: 4, value: 5, count: 3 },
  ];
  assert.equal(boundedKnapsack(items, 10), brute(items, 10));
  assert.equal(boundedKnapsack(items, 10), 14); // w2×3+w4×1 = w10,v14
});

test('bounded-knapsack 与暴力对拍', () => {
  const rng = (s: number) => () => (s = (s * 1103515245 + 12345) & 0x7fffffff);
  const rand = rng(21);
  for (let t = 0; t < 200; t++) {
    const n = 1 + (rand() % 5);
    const items: BoundedItem[] = [];
    for (let i = 0; i < n; i++) {
      items.push({ weight: 1 + (rand() % 5), value: rand() % 10, count: 1 + (rand() % 8) });
    }
    const cap = rand() % 20;
    assert.equal(
      boundedKnapsack(items, cap),
      brute(items, cap),
      `mismatch ${JSON.stringify(items)} cap=${cap}`,
    );
  }
});

test('bounded-knapsack 钩子被调用', () => {
  let split = 0;
  let upd = 0;
  let done = -1;
  boundedKnapsack([{ weight: 2, value: 3, count: 4 }], 8, {
    onSplit: () => split++,
    onPackUpdate: () => upd++,
    onDone: (v) => {
      done = v;
    },
  });
  assert.ok(split >= 3, '应拆出至少 3 组（1+2+1）');
  assert.ok(upd >= 0);
  assert.equal(done, 12); // 取 4 件 → v12
});
