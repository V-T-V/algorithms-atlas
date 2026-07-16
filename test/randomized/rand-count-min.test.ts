import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CountMin } from '../../src/algorithms/randomized/rand-count-min/impl.ts';
test('估计至少为真实', () => {
  const c = new CountMin(5, 200);
  for (let i = 0; i < 10; i++) c.add(7);
  assert.ok(c.estimate(7) >= 10);
});
