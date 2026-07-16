import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  knapsackComplete,
  reconstructCounts,
  type KnapsackItem,
} from '../../src/algorithms/dp/knapsack-complete/impl.ts';

/** 暴力枚举校验完全背包最优值（物品件数与容量都较小时）。 */
function bruteForce(items: KnapsackItem[], capacity: number): number {
  let best = 0;
  const dfs = (idx: number, cap: number, val: number): void => {
    if (idx >= items.length) {
      if (val > best) best = val;
      return;
    }
    // 选 0..max 件 items[idx]
    const maxCount = Math.floor(capacity / items[idx]!.weight) + 1;
    for (let c = 0; c <= maxCount; c++) {
      const nc = cap - c * items[idx]!.weight;
      if (nc < 0) break;
      dfs(idx + 1, nc, val + c * items[idx]!.value);
    }
  };
  dfs(0, capacity, 0);
  return best;
}

const DEFAULT: { items: KnapsackItem[]; capacity: number } = {
  items: [
    { weight: 2, value: 3 },
    { weight: 3, value: 4 },
    { weight: 4, value: 5 },
    { weight: 5, value: 8 },
  ],
  capacity: 10,
};

test('knapsack-complete 演示默认值', () => {
  const r = knapsackComplete(DEFAULT.items, DEFAULT.capacity);
  // 最优：物品4(w5,v8) ×2 = w10, v16
  assert.equal(r.value, 16);
});

test('knapsack-complete 与暴力枚举一致', () => {
  const cases: Array<{ items: KnapsackItem[]; capacity: number }> = [
    {
      items: [
        { weight: 2, value: 3 },
        { weight: 3, value: 4 },
      ],
      capacity: 7,
    },
    {
      items: [
        { weight: 1, value: 1 },
        { weight: 3, value: 4 },
      ],
      capacity: 6,
    },
    {
      items: [
        { weight: 2, value: 5 },
        { weight: 5, value: 11 },
      ],
      capacity: 11,
    },
    DEFAULT,
  ];
  for (const c of cases) {
    assert.equal(knapsackComplete(c.items, c.capacity).value, bruteForce(c.items, c.capacity));
  }
});

test('knapsack-complete 单件物品重复选取', () => {
  // 仅 1 件 w3v5，容量 10 → 选 3 件 = v15
  const r = knapsackComplete([{ weight: 3, value: 5 }], 10);
  assert.equal(r.value, 15);
});

test('knapsack-complete 所有物品都装不下', () => {
  const r = knapsackComplete([{ weight: 10, value: 100 }], 5);
  assert.equal(r.value, 0);
});

test('knapsack-complete 物品重量为 1 可填满', () => {
  const r = knapsackComplete([{ weight: 1, value: 1 }], 7);
  assert.equal(r.value, 7);
});

test('knapsack-complete 空物品或零容量', () => {
  assert.equal(knapsackComplete([], 10).value, 0);
  assert.equal(knapsackComplete([{ weight: 2, value: 3 }], 0).value, 0);
});

test('knapsack-complete 回溯选取次数正确', () => {
  const r = knapsackComplete(DEFAULT.items, DEFAULT.capacity);
  const counts = reconstructCounts(DEFAULT.items, DEFAULT.capacity, r.dp);
  // 校验：按次数装入，重量不超过容量，价值等于最优
  let totalW = 0;
  let totalV = 0;
  for (let i = 0; i < DEFAULT.items.length; i++) {
    totalW += counts[i]! * DEFAULT.items[i]!.weight;
    totalV += counts[i]! * DEFAULT.items[i]!.value;
  }
  assert.ok(totalW <= DEFAULT.capacity, '总重不超过容量');
  assert.equal(totalV, r.value, '按次数装入的价值 = 最优值');
  // 物品4 应被选 2 次
  assert.equal(counts[3], 2);
});

test('knapsack-complete 钩子被调用', () => {
  let cells = 0;
  let takeCells = 0;
  knapsackComplete(DEFAULT.items, DEFAULT.capacity, {
    onFillCell: (_i, _w, _val, from) => {
      cells++;
      if (from === 'take') takeCells++;
    },
  });
  assert.equal(cells, DEFAULT.items.length * (DEFAULT.capacity + 1));
  assert.ok(takeCells >= 1, '至少一次选取');
});
