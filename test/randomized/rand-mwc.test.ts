import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Mwc, mwc } from '../../src/algorithms/randomized/rand-mwc/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-mwc/trace.ts';

test('rand-mwc 在 [0,1)', () => {
  const r = new Mwc(12345);
  for (let i = 0; i < 100; i++) {
    const v = r.next();
    assert.ok(v >= 0 && v < 1, `v=${v}`);
  }
});

test('rand-mwc 确定性', () => {
  assert.deepEqual(mwc(10, 5), mwc(10, 5));
});

test('rand-mwc 均值接近 0.5', () => {
  const s = mwc(3000, 999);
  const mean = s.reduce((a, b) => a + b, 0) / s.length;
  assert.ok(Math.abs(mean - 0.5) < 0.04, `mean=${mean}`);
});

test('rand-mwc trace', () => {
  assert.ok(buildTrace().length > 2);
});
