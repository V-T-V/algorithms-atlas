import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalanTriangle } from '../../src/algorithms/math/catalan-triangle/impl.ts';

test('catalanTriangle 对角线为 Catalan 数', () => {
  const { catalan } = catalanTriangle(8);
  // C_0..C_8: 1,1,2,5,14,42,132,429,1430
  assert.deepEqual(catalan, [1, 1, 2, 5, 14, 42, 132, 429, 1430]);
});

test('catalanTriangle 单元格关系', () => {
  const { table } = catalanTriangle(5);
  // T(n,k) = T(n,k-1) + T(n-1,k)（对 1<=k<=n-1）
  for (let n = 1; n <= 5; n++) {
    for (let k = 1; k <= n - 1; k++) {
      assert.equal(table[n]![k], table[n]![k - 1]! + (table[n - 1]?.[k] ?? 0), `T(${n},${k})`);
    }
  }
  // 对角线 T(n,n) = T(n,n-1)（因 table[n-1][n] 不存在视为 0）
  for (let n = 1; n <= 5; n++) {
    assert.equal(table[n]![n], table[n]![n - 1]! + (table[n - 1]?.[n] ?? 0), `diag T(${n},${n})`);
  }
});

test('catalanTriangle 首列为 1', () => {
  const { table } = catalanTriangle(5);
  for (let n = 0; n <= 5; n++) assert.equal(table[n]![0], 1);
});

test('catalanTriangle 边界', () => {
  assert.deepEqual(catalanTriangle(0).catalan, [1]);
  assert.throws(() => catalanTriangle(-1), RangeError);
});
