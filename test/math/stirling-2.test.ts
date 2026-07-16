import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stirling2 } from '../../src/algorithms/math/stirling-2/impl.ts';

test('stirling2 基本值', () => {
  // S(4,2)=7, S(5,3)=25, S(5,2)=15, S(6,3)=90
  assert.equal(Number(stirling2(4, 2)[4]![2]), 7);
  assert.equal(Number(stirling2(5, 3)[5]![3]), 25);
  assert.equal(Number(stirling2(5, 2)[5]![2]), 15);
  assert.equal(Number(stirling2(6, 3)[6]![3]), 90);
});

test('stirling2 边界', () => {
  assert.equal(Number(stirling2(0, 0)[0]![0]), 1);
  assert.equal(Number(stirling2(5, 0)[5]![0]), 0);
  assert.equal(Number(stirling2(1, 1)[1]![1]), 1);
  assert.equal(Number(stirling2(5, 5)[5]![5]), 1);
});

test('stirling2 整行验证', () => {
  // n=5: S(5,1..5) = 1, 15, 25, 10, 1
  const dp = stirling2(5, 5);
  const row = dp[5]!.slice(1, 6).map((x) => Number(x));
  assert.deepEqual(row, [1, 15, 25, 10, 1]);
});

test('stirling2 错误', () => {
  assert.throws(() => stirling2(-1, 2), RangeError);
  assert.throws(() => stirling2(3, -1), RangeError);
});

test('stirling2 钩子被调用', () => {
  let cells = 0;
  stirling2(4, 2, { onCell: () => cells++ });
  assert.ok(cells > 0, '应填多个单元格');
});
