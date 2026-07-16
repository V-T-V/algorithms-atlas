import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Kiss, kiss } from '../../src/algorithms/randomized/rand-kiss/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-kiss/trace.ts';

test('rand-kiss 在 [0,1)', () => {
  const r = new Kiss(1);
  for (let i = 0; i < 100; i++) {
    const v = r.next();
    assert.ok(v >= 0 && v < 1);
  }
});

test('rand-kiss 确定性', () => {
  assert.deepEqual(kiss(10, 5), kiss(10, 5));
});

test('rand-kiss 均值接近 0.5', () => {
  const s = kiss(3000, 11);
  const mean = s.reduce((a, b) => a + b, 0) / s.length;
  assert.ok(Math.abs(mean - 0.5) < 0.04, `mean=${mean}`);
});

test('rand-kiss trace', () => {
  assert.ok(buildTrace().length > 2);
});
