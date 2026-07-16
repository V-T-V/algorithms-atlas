import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pascalsTriangle, pascalRow } from '../../src/algorithms/misc/pascals-triangle/impl.ts';

test('pascalsTriangle 前 6 行', () => {
  const t = pascalsTriangle(6);
  assert.deepEqual(t, [
    [1],
    [1, 1],
    [1, 2, 1],
    [1, 3, 3, 1],
    [1, 4, 6, 4, 1],
    [1, 5, 10, 10, 5, 1],
  ]);
});

test('pascalsTriangle 行数正确', () => {
  const t = pascalsTriangle(10);
  assert.equal(t.length, 10);
  for (let r = 0; r < 10; r++) assert.equal(t[r]!.length, r + 1);
});

test('pascalsTriangle 行和 = 2^r', () => {
  const t = pascalsTriangle(12);
  for (let r = 0; r < 12; r++) {
    const sum = t[r]!.reduce((s, x) => s + x, 0);
    assert.equal(sum, 2 ** r, `row ${r}`);
  }
});

test('pascalsTriangle 对称性', () => {
  const t = pascalsTriangle(8);
  for (let r = 0; r < 8; r++) {
    const row = t[r]!;
    for (let c = 0; c < row.length / 2; c++) {
      assert.equal(row[c], row[row.length - 1 - c]);
    }
  }
});

test('pascalRow 与三角形一致', () => {
  const t = pascalsTriangle(10);
  for (let r = 0; r < 10; r++) {
    assert.deepEqual(pascalRow(r), t[r]);
  }
});

test('pascalRow 单行 = C(n,k)', () => {
  // C(5,2) = 10
  assert.equal(pascalRow(5)[2], 10);
  assert.equal(pascalRow(6)[3], 20);
});

test('pascalsTriangle 边界', () => {
  assert.deepEqual(pascalsTriangle(0), []);
  assert.deepEqual(pascalsTriangle(1), [[1]]);
});

test('pascalsTriangle 非法输入抛错', () => {
  assert.throws(() => pascalsTriangle(-1));
  assert.throws(() => pascalsTriangle(1.5));
});
