import { test } from 'node:test';
import assert from 'node:assert/strict';
import { completeAssignment } from '../../src/algorithms/network/net-assignment-complete/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-assignment-complete/trace.ts';

test('net-assignment-complete 3×3 经典', () => {
  // 最优：工0→任1(2)，工1→任2(3)，工2→任0(5) 或类似；总代价最小
  const cost = [
    [9, 2, 7],
    [6, 4, 3],
    [5, 8, 1],
  ];
  const r = completeAssignment(cost);
  // 验证总费用正确：枚举最小
  const perms = (arr: number[]): number[][] =>
    arr.length === 0
      ? [[]]
      : arr.flatMap((x) => perms(arr.filter((y) => y !== x)).map((p) => [x, ...p]));
  let minTotal = Infinity;
  for (const p of perms([0, 1, 2])) {
    let t = 0;
    for (let i = 0; i < 3; i++) t += cost[i]![p[i]!]!;
    minTotal = Math.min(minTotal, t);
  }
  assert.equal(r.totalCost, minTotal);
  // 分配是排列
  assert.equal(new Set(r.assignment).size, 3);
});

test('net-assignment-complete 单元素', () => {
  const r = completeAssignment([[5]]);
  assert.equal(r.totalCost, 5);
  assert.equal(r.assignment[0], 0);
});

test('net-assignment-complete 对角最优', () => {
  // 对角代价最小
  const cost = [
    [1, 9, 9],
    [9, 1, 9],
    [9, 9, 1],
  ];
  const r = completeAssignment(cost);
  assert.equal(r.totalCost, 3);
  assert.deepEqual(r.assignment, [0, 1, 2]);
});

test('net-assignment-complete 总费用与分配一致', () => {
  const cost = [
    [4, 1],
    [2, 3],
  ];
  const r = completeAssignment(cost);
  let sum = 0;
  for (let i = 0; i < 2; i++) sum += cost[i]![r.assignment[i]!]!;
  assert.equal(sum, r.totalCost);
});

test('net-assignment-complete trace', () => {
  assert.ok(buildTrace().length >= 2);
});
