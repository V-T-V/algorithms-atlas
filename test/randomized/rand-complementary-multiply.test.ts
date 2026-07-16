import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Cmwc, cmwc } from '../../src/algorithms/randomized/rand-complementary-multiply/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-complementary-multiply/trace.ts';

test('rand-complementary-multiply 在 [0,1)', () => {
  const r = new Cmwc(1);
  for (let i = 0; i < 100; i++) {
    const v = r.next();
    assert.ok(v >= 0 && v < 1, `v=${v}`);
  }
});

test('rand-complementary-multiply 确定性', () => {
  assert.deepEqual(cmwc(10, 5), cmwc(10, 5));
});

test('rand-complementary-multiply 均值接近 0.5', () => {
  const s = cmwc(2000, 9);
  const mean = s.reduce((a, b) => a + b, 0) / s.length;
  assert.ok(Math.abs(mean - 0.5) < 0.05, `mean=${mean}`);
});

test('rand-complementary-multiply trace', () => {
  assert.ok(buildTrace().length > 2);
});
