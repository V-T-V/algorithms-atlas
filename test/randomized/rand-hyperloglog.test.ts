import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HyperLogLogLite } from '../../src/algorithms/randomized/rand-hyperloglog/impl.ts';
test('估计为正', () => {
  const h = new HyperLogLogLite();
  for (let i = 0; i < 1000; i++) h.add(i);
  assert.ok(h.estimate() >= 1);
});
