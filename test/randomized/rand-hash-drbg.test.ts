import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HashDrbg, hashDrbg } from '../../src/algorithms/randomized/rand-hash-drbg/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-hash-drbg/trace.ts';

test('rand-hash-drbg 在 [0,1)', () => {
  const r = new HashDrbg(7);
  for (let i = 0; i < 100; i++) {
    const v = r.next();
    assert.ok(v >= 0 && v < 1);
  }
});

test('rand-hash-drbg 确定性', () => {
  assert.deepEqual(hashDrbg(10, 3), hashDrbg(10, 3));
});

test('rand-hash-drbg 均值接近 0.5', () => {
  const s = hashDrbg(2000, 5);
  const mean = s.reduce((a, b) => a + b, 0) / s.length;
  assert.ok(Math.abs(mean - 0.5) < 0.05, `mean=${mean}`);
});

test('rand-hash-drbg trace', () => {
  assert.ok(buildTrace().length > 2);
});
