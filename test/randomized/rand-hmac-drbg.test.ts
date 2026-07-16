import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HmacDrbg, hmacDrbg } from '../../src/algorithms/randomized/rand-hmac-drbg/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-hmac-drbg/trace.ts';

test('rand-hmac-drbg 在 [0,1)', () => {
  const r = new HmacDrbg(3);
  for (let i = 0; i < 100; i++) {
    const v = r.next();
    assert.ok(v >= 0 && v < 1);
  }
});

test('rand-hmac-drbg 确定性', () => {
  assert.deepEqual(hmacDrbg(10, 3), hmacDrbg(10, 3));
});

test('rand-hmac-drbg 均值接近 0.5', () => {
  const s = hmacDrbg(2000, 5);
  const mean = s.reduce((a, b) => a + b, 0) / s.length;
  assert.ok(Math.abs(mean - 0.5) < 0.05, `mean=${mean}`);
});

test('rand-hmac-drbg trace', () => {
  assert.ok(buildTrace().length > 2);
});
