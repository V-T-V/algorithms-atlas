import { test } from 'node:test';
import assert from 'node:assert/strict';
import { knapsack01, type KnapsackItem } from '../../src/algorithms/dp/knapsack-01/impl.ts';

// 辅助：校验解合法（重量不超、价值匹配、且 chosen 是正确子集）。
function check(items: readonly KnapsackItem[], capacity: number, expectValue: number): void {
  const { value, chosen } = knapsack01(items, capacity);
  assert.equal(value, expectValue, `value mismatch (capacity ${capacity})`);
  // 重量合法
  let totalW = 0;
  let totalV = 0;
  for (const idx of chosen) {
    const it = items[idx]!;
    totalW += it.weight;
    totalV += it.value;
  }
  assert.ok(totalW <= capacity, `chosen weight ${totalW} exceeds capacity ${capacity}`);
  assert.equal(totalV, expectValue, `reconstructed value ${totalV} != ${expectValue}`);
}

test('knapsack01 基本行为', () => {
  assert.deepEqual(knapsack01([], 10), { value: 0, chosen: [] });
  assert.deepEqual(knapsack01([{ weight: 2, value: 5 }], 0), { value: 0, chosen: [] });
});

test('knapsack01 经典用例', () => {
  const items: KnapsackItem[] = [
    { weight: 2, value: 3 },
    { weight: 3, value: 4 },
    { weight: 4, value: 5 },
    { weight: 5, value: 8 },
  ];
  check(items, 8, 12); // 物品 2(w3,v4) + 物品 4(w5,v8) = w8, v12
  // 维基经典例：weights [1,2,3], values [6,10,12], capacity 5 → value 22
  check(
    [
      { weight: 1, value: 6 },
      { weight: 2, value: 10 },
      { weight: 3, value: 12 },
    ],
    5,
    22,
  );
});

test('knapsack01 全部装得下', () => {
  const items: KnapsackItem[] = [
    { weight: 1, value: 1 },
    { weight: 2, value: 2 },
  ];
  const { value, chosen } = knapsack01(items, 100);
  assert.equal(value, 3);
  assert.equal(chosen.length, 2);
});

test('knapsack01 钩子被调用', () => {
  let take = 0;
  let fill = 0;
  knapsack01(
    [
      { weight: 2, value: 3 },
      { weight: 3, value: 4 },
    ],
    5,
    {
      onFillCell: (_i, _w, _v, from) => {
        fill++;
        if (from === 'take') take++;
      },
      onBacktrack: () => {},
    },
  );
  assert.ok(fill > 0, '应触发 onFillCell');
  assert.ok(take > 0, '至少有一次选入');
});
