import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Rc4Rng, rc4Rng } from '../../src/algorithms/randomized/rand-rc4-rng/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-rc4-rng/trace.ts';

test('rand-rc4-rng 在 [0,1)', () => {
  const r = new Rc4Rng([1, 2, 3]);
  for (let i = 0; i < 100; i++) {
    const v = r.next();
    assert.ok(v >= 0 && v < 1);
  }
});

test('rand-rc4-rng 确定性', () => {
  assert.deepEqual(rc4Rng(10, [5, 6]), rc4Rng(10, [5, 6]));
});

test('rand-rc4-rng 不同种子不同', () => {
  assert.notDeepEqual(rc4Rng(5, [1]), rc4Rng(5, [2]));
});

test('rand-rc4-rng 均值接近 0.5', () => {
  const s = rc4Rng(2000, [9, 8, 7]);
  const mean = s.reduce((a, b) => a + b, 0) / s.length;
  assert.ok(Math.abs(mean - 0.5) < 0.05, `mean=${mean}`);
});

test('rand-rc4-rng trace', () => {
  assert.ok(buildTrace().length > 2);
});
