import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  knapsackMultiple,
  binarySplit,
  type KnapsackItem,
} from '../../src/algorithms/dp/knapsack-multiple/impl.ts';

/** 朴素二维多重背包（O(n·C·count)）作为参考校验。 */
function bruteForce(items: KnapsackItem[], capacity: number): number {
  const n = items.length;
  const f: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(capacity + 1).fill(0),
  );
  for (let i = 1; i <= n; i++) {
    const it = items[i - 1]!;
    for (let w = 0; w <= capacity; w++) {
      f[i]![w] = f[i - 1]![w]!;
      for (let c = 1; c <= it.count && c * it.weight <= w; c++) {
        const cand = f[i - 1]![w - c * it.weight]! + c * it.value;
        if (cand > f[i]![w]!) f[i]![w] = cand;
      }
    }
  }
  return f[n]![capacity]!;
}

const DEFAULT: { items: KnapsackItem[]; capacity: number } = {
  items: [
    { weight: 2, value: 3, count: 3 },
    { weight: 3, value: 4, count: 2 },
    { weight: 4, value: 5, count: 1 },
  ],
  capacity: 10,
};

test('knapsack-multiple 演示默认值', () => {
  // 3×w2(v9) + 1×w4(v5) = w10, v14（或 2×w2+2×w3 = w10 v14）
  assert.equal(knapsackMultiple(DEFAULT.items, DEFAULT.capacity), 14);
});

test('knapsack-multiple 与朴素多重背包一致', () => {
  const cases: Array<{ items: KnapsackItem[]; capacity: number }> = [
    DEFAULT,
    { items: [{ weight: 1, value: 2, count: 5 }], capacity: 4 },
    {
      items: [
        { weight: 3, value: 5, count: 7 },
        { weight: 2, value: 3, count: 4 },
      ],
      capacity: 13,
    },
    {
      items: [
        { weight: 5, value: 10, count: 1 },
        { weight: 4, value: 7, count: 3 },
      ],
      capacity: 15,
    },
  ];
  for (const c of cases) {
    assert.equal(
      knapsackMultiple(c.items, c.capacity),
      bruteForce(c.items, c.capacity),
      `capacity=${c.capacity}`,
    );
  }
});

test('knapsack-multiple count=0 等价于该物品不存在', () => {
  const r = knapsackMultiple(
    [
      { weight: 2, value: 3, count: 0 },
      { weight: 3, value: 4, count: 2 },
    ],
    6,
  );
  // 只能用物品2：2×w3=w6 v8
  assert.equal(r, 8);
});

test('knapsack-multiple 大数量 count 与完全背包吻合（当 count 足够大）', () => {
  // 容量 6，w2v3 上限 100 → 等价完全背包：3 件 = w6 v9
  const r = knapsackMultiple([{ weight: 2, value: 3, count: 100 }], 6);
  assert.equal(r, 9);
});

test('knapsack-multiple 物品装不下', () => {
  assert.equal(knapsackMultiple([{ weight: 10, value: 100, count: 3 }], 5), 0);
});

test('knapsack-multiple 空物品或零容量', () => {
  assert.equal(knapsackMultiple([], 10), 0);
  assert.equal(knapsackMultiple([{ weight: 2, value: 3, count: 2 }], 0), 0);
});

test('knapsack-multiple binarySplit 正确性', () => {
  // 13 = 1+2+4+6
  assert.deepEqual(binarySplit(13), [1, 2, 4, 6]);
  // 8 = 1+2+4+1
  assert.deepEqual(binarySplit(8), [1, 2, 4, 1]);
  // 1 = [1]
  assert.deepEqual(binarySplit(1), [1]);
  // 和等于原值
  for (const c of [0, 1, 5, 13, 100, 255]) {
    const sum = binarySplit(c).reduce((a, b) => a + b, 0);
    assert.equal(sum, c, `binarySplit(${c}) 之和应为 ${c}`);
  }
});

test('knapsack-multiple binarySplit 能表出 0..count 所有数', () => {
  const c = 13;
  const parts = binarySplit(c);
  const reachable = new Set<number>([0]);
  for (const p of parts) {
    for (const x of [...reachable]) reachable.add(x + p);
  }
  for (let i = 0; i <= c; i++) assert.ok(reachable.has(i), `应能表出 ${i}`);
});

test('knapsack-multiple 钩子被调用', () => {
  let splits = 0;
  let doneVal = -1;
  knapsackMultiple(DEFAULT.items, DEFAULT.capacity, {
    onSplit: () => splits++,
    onDone: (v) => {
      doneVal = v;
    },
  });
  assert.equal(splits, DEFAULT.items.length, '每件物品拆分一次');
  assert.equal(doneVal, 14);
});
