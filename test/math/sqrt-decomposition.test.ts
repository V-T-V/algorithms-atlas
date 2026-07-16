import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sqrtDecomposition } from '../../src/algorithms/math/sqrt-decomposition/impl.ts';

test('sqrtDecomposition 区间求和正确', () => {
  const arr = [5, 2, 8, 1, 9, 3, 7, 4, 6, 0, 3, 5];
  const sd = sqrtDecomposition(arr);
  // 暴力和
  const brute = (lo: number, hi: number): number =>
    arr.slice(lo, hi + 1).reduce((s, v) => s + v, 0);
  for (let lo = 0; lo < arr.length; lo++) {
    for (let hi = lo; hi < arr.length; hi++) {
      assert.equal(sd.query(lo, hi), brute(lo, hi), `sum[${lo}..${hi}]`);
    }
  }
});

test('sqrtDecomposition 点更新后查询正确', () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const sd = sqrtDecomposition(arr);
  sd.update(3, 100); // arr[3] = 4 -> 100
  assert.equal(sd.query(0, 8), 1 + 2 + 3 + 100 + 5 + 6 + 7 + 8 + 9);
  assert.equal(sd.query(3, 3), 100);
});

test('sqrtDecomposition 边界', () => {
  const sd = sqrtDecomposition([7]);
  assert.equal(sd.query(0, 0), 7);
  assert.equal(sqrtDecomposition([]).query(0, 0), 0);
});

test('sqrtDecomposition 钩子被调用', () => {
  let blocks = 0;
  let queries = 0;
  const sd = sqrtDecomposition([5, 2, 8, 1, 9, 3, 7, 4, 6], {
    onBlockBuild: () => blocks++,
    onQuery: () => queries++,
  });
  sd.query(1, 7);
  assert.ok(blocks > 0, '应建多个块');
  assert.equal(queries, 1, 'onQuery 恰好一次');
});
