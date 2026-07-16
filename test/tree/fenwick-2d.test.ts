import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  Fenwick2D,
  fenwick2d,
  type Fenwick2dHooks,
} from '../../src/algorithms/tree/fenwick-2d/impl.ts';

function bruteRect(mat: number[][], r1: number, c1: number, r2: number, c2: number): number {
  let s = 0;
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) s += mat[r]![c]!;
  }
  return s;
}

test('fenwick-2d 初始矩阵前缀和与朴素一致', () => {
  const initial = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
  ];
  const ft = new Fenwick2D(4, 4, initial);
  // 暴力参考矩阵（1-based）
  const brute: number[][] = [[], [], [], [], []];
  for (let r = 0; r < 4; r++) {
    brute[r + 1] = [0, ...(initial[r] ?? [])];
  }
  // 抽几个 prefixSum
  assert.equal(ft.prefixSum(1, 1), 1);
  assert.equal(ft.prefixSum(2, 2), 1 + 2 + 5 + 6);
  assert.equal(ft.prefixSum(4, 4), bruteRect(brute, 1, 1, 4, 4));
});

test('fenwick-2d update 后矩形查询', () => {
  const initial = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  const ft = new Fenwick2D(3, 3, initial);
  // 加一个 delta
  ft.update(2, 2, 100);
  // (2,2) 区域受影响
  assert.equal(ft.rectSum(2, 2, 2, 2), 5 + 100);
  assert.equal(ft.rectSum(1, 1, 3, 3), 45 + 100);
  // 减一个
  ft.update(1, 3, -3);
  assert.equal(ft.rectSum(1, 1, 3, 3), 45 + 100 - 3);
});

test('fenwick-2d 便捷封装返回多个查询', () => {
  const result = fenwick2d(
    [
      [1, 2],
      [3, 4],
    ],
    [
      { r1: 1, c1: 1, r2: 2, c2: 2 }, // 全部 = 10
      { r1: 1, c1: 1, r2: 1, c2: 2 }, // 顶行 = 3
      { r1: 2, c1: 1, r2: 2, c2: 2 }, // 底行 = 7
    ],
  );
  assert.deepEqual(result, [10, 3, 7]);
});

test('fenwick-2d hooks 被触发', () => {
  const updates: Array<[number, number, number]> = [];
  const jumps: Array<[number, number]> = [];
  const hooks: Fenwick2dHooks = {
    onUpdate: (r, c, d) => updates.push([r, c, d]),
    onQueryJump: (i, j) => jumps.push([i, j]),
  };
  const ft = new Fenwick2D(2, 2, [], hooks);
  ft.update(1, 1, 5);
  ft.update(2, 2, 7);
  assert.deepEqual(updates, [
    [1, 1, 5],
    [2, 2, 7],
  ]);
  ft.prefixSum(2, 2);
  // 跳点数 > 0
  assert.ok(jumps.length > 0);
});

test('fenwick-2d 与暴力完全一致（随机）', () => {
  const n = 5;
  const m = 5;
  const initial = Array.from({ length: n }, () =>
    Array.from({ length: m }, () => Math.floor(Math.random() * 20) - 10),
  );
  const ft = new Fenwick2D(n, m, initial);
  const brute: number[][] = [[]];
  brute[0] = new Array(m + 1).fill(0);
  for (let r = 0; r < n; r++) {
    brute[r + 1] = [0, ...(initial[r] ?? [])];
  }
  for (let r1 = 1; r1 <= n; r1++) {
    for (let c1 = 1; c1 <= m; c1++) {
      for (let r2 = r1; r2 <= n; r2++) {
        for (let c2 = c1; c2 <= m; c2++) {
          assert.equal(ft.rectSum(r1, c1, r2, c2), bruteRect(brute, r1, c1, r2, c2));
        }
      }
    }
  }
});
