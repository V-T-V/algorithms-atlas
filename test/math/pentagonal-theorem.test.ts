import { test } from 'node:test';
import assert from 'node:assert/strict';
import { partitionByPentagonal } from '../../src/algorithms/math/pentagonal-theorem/impl.ts';

const MOD = 1_000_000_007;
const SEQ = [1, 1, 2, 3, 5, 7, 11, 15, 22, 30, 42];

test('pentagonal 与标准划分序列一致', () => {
  const p = partitionByPentagonal(10, MOD);
  assert.deepEqual(p, SEQ);
});

test('pentagonal 大 n 取模', () => {
  const p = partitionByPentagonal(50, MOD);
  assert.equal(p.length, 51);
  assert.equal(p[10], 42);
  assert.ok(p[50]! > 0);
});

test('pentagonal 边界', () => {
  assert.deepEqual(partitionByPentagonal(0, MOD), [1]);
  assert.deepEqual(partitionByPentagonal(-1, MOD), []);
});

test('pentagonal 与 O(n²) 一致（交叉验证）', async () => {
  const { partitionNumber } = await import('../../src/algorithms/math/partition-number/impl.ts');
  const pFast = partitionByPentagonal(20, MOD);
  for (let n = 0; n <= 20; n++) {
    assert.equal(pFast[n], partitionNumber(n, MOD), `p(${n})`);
  }
});

test('pentagonal 钩子', () => {
  let steps = 0;
  partitionByPentagonal(5, MOD, { onStep: () => steps++ });
  assert.equal(steps, 6); // n=0..5
});
