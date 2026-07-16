import { test } from 'node:test';
import assert from 'node:assert/strict';
import { narayanaTriangle, narayana } from '../../src/algorithms/math/narayana-number/impl.ts';

test('narayana 已知值', () => {
  // N(4,k): 1,6,6,1；N(5,k): 1,10,20,10,1
  const t = narayanaTriangle(5);
  assert.deepEqual(t[3], [1n, 6n, 6n, 1n]); // 第 4 行（索引 3）
  assert.deepEqual(t[4], [1n, 10n, 20n, 10n, 1n]); // 第 5 行（索引 4）
});

test('narayana 行和为 Catalan 数', () => {
  const t = narayanaTriangle(8);
  // t[i] 为第 i+1 行，行和 = C_{i+1}：1,2,5,14,42,132,429,1430
  const catalan = [1n, 2n, 5n, 14n, 42n, 132n, 429n, 1430n];
  for (let i = 0; i < 8; i++) {
    const sum = t[i]!.reduce((a, b) => a + b, 0n);
    assert.equal(sum, catalan[i], `row ${i + 1}`);
  }
});

test('narayana 单值', () => {
  assert.equal(narayana(4, 2), 6n);
  assert.equal(narayana(5, 3), 20n);
});

test('narayana 边界', () => {
  assert.equal(narayana(0, 0), 0n);
  assert.equal(narayana(3, 0), 0n);
  assert.equal(narayana(3, 5), 0n);
});
