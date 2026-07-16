import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fractionalKnapsack,
  type FractionalKnapsackHooks,
  type KnapsackItem,
} from '../../src/algorithms/greedy/fractional-knapsack/impl.ts';

// 校验总价值与总重量合法。
function check(items: KnapsackItem[], capacity: number, expectValue: number): void {
  const r = fractionalKnapsack(items, capacity);
  assert.ok(
    Math.abs(r.totalValue - expectValue) < 1e-6,
    `value ${r.totalValue} != expected ${expectValue}`,
  );
  assert.ok(r.totalWeight <= capacity + 1e-9, `weight ${r.totalWeight} > capacity ${capacity}`);
}

test('fractional-knapsack 边界情况', () => {
  assert.deepEqual(fractionalKnapsack([], 10), {
    totalValue: 0,
    totalWeight: 0,
    takes: [],
  });
  // 容量为 0
  assert.equal(fractionalKnapsack([{ weight: 2, value: 5 }], 0).totalValue, 0);
});

test('fractional-knapsack 经典用例（维基）', () => {
  // w/v: 6, 5, 4 → 按密度降序：物品1(6), 物品2(5), 物品3(4)
  // 容量 50：整件物品1(10,60)+物品2(20,100) = 30/160；剩余 20 装物品3 的 2/3 → +80 = 240
  check(
    [
      { weight: 10, value: 60 },
      { weight: 20, value: 100 },
      { weight: 30, value: 120 },
    ],
    50,
    240,
  );
});

test('fractional-knapsack 全部装得下（无需切分）', () => {
  const r = fractionalKnapsack(
    [
      { weight: 2, value: 3 },
      { weight: 3, value: 4 },
    ],
    100,
  );
  assert.equal(r.totalValue, 7);
  assert.equal(
    r.takes.every((t) => t.fraction === 1),
    true,
  );
});

test('fractional-knapsack 切分比例正确', () => {
  // 只有一件物品，容量只能装一半
  const r = fractionalKnapsack([{ weight: 10, value: 20 }], 5);
  assert.ok(Math.abs(r.totalValue - 10) < 1e-9);
  assert.equal(r.takes.length, 1);
  assert.ok(Math.abs(r.takes[0]!.fraction - 0.5) < 1e-9);
  assert.equal(r.totalWeight, 5);
});

test('fractional-knapsack 贪心优于任意单件（密度优先）', () => {
  // 高价值但低密度 vs 低价值高密度：应优先装高密度
  const r = fractionalKnapsack(
    [
      { weight: 100, value: 100 }, // 密度 1
      { weight: 1, value: 50 }, // 密度 50
    ],
    50,
  );
  // 先装密度 50 的整件（1 重 50 价值），剩余 49 装密度 1 的 → +49 = 99
  assert.ok(Math.abs(r.totalValue - 99) < 1e-9);
});

test('fractional-knapsack 钩子被调用', () => {
  let sorts = 0;
  let fulls = 0;
  let fracs = 0;
  const hooks: FractionalKnapsackHooks = {
    onSort: () => sorts++,
    onTakeFull: () => fulls++,
    onTakeFraction: () => fracs++,
  };
  fractionalKnapsack(
    [
      { weight: 10, value: 60 },
      { weight: 20, value: 100 },
      { weight: 30, value: 120 },
    ],
    50,
    hooks,
  );
  assert.equal(sorts, 1, '应触发一次 onSort');
  assert.ok(fulls >= 2, `应至少整件装 2 件，实际 ${fulls}`);
  assert.ok(fracs >= 1, `应至少切分装 1 件，实际 ${fracs}`);
});
