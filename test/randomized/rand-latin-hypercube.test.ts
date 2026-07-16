import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  latinHypercube,
  isLatinHypercube,
} from '../../src/algorithms/randomized/rand-latin-hypercube/impl.ts';

test('latinHypercube 样本数与维度正确', () => {
  const s = latinHypercube(10, 3);
  assert.equal(s.length, 10);
  for (const row of s) assert.equal(row.length, 3);
});

test('latinHypercube 满足 LHS 性质', () => {
  for (const n of [5, 8, 12]) {
    for (const k of [1, 2, 3]) {
      const s = latinHypercube(n, k);
      assert.ok(isLatinHypercube(s, n, k), `n=${n},k=${k} 不满足 LHS`);
    }
  }
});

test('latinHypercube 样本在 [0,1)', () => {
  const s = latinHypercube(20, 4);
  for (const row of s)
    for (const v of row) {
      assert.ok(v >= 0 && v < 1);
    }
});

test('latinHypercube 确定性', () => {
  const a = latinHypercube(8, 2);
  const b = latinHypercube(8, 2);
  assert.deepEqual(a, b);
});

test('isLatinHypercube 检测失效', () => {
  // 两点都在同一段 → 不是 LHS
  assert.equal(
    isLatinHypercube(
      [
        [0.1, 0.1],
        [0.15, 0.6],
      ],
      2,
      2,
    ),
    false,
  );
});

test('latinHypercube 边界', () => {
  assert.deepEqual(latinHypercube(0, 3), []);
  assert.deepEqual(latinHypercube(5, 0), []);
});
