import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomPowerOfTwo } from '../../src/algorithms/randomized/rand-power-of-two/impl.ts';
test('是 2 的幂', () => {
  for (let s = 1; s < 20; s++) {
    const v = randomPowerOfTwo(s, 5);
    assert.ok(v > 0 && (v & (v - 1)) === 0);
  }
});
