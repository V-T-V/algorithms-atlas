import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mobiusSieve } from '../../src/algorithms/math/math-mobius-3/impl.ts';

test('mobius 基本值', () => {
  const mu = mobiusSieve(20);
  assert.equal(mu[1], 1);
  assert.equal(mu[2], -1);
  assert.equal(mu[6], 1); // 2·3
  assert.equal(mu[4], 0); // 2²
  assert.equal(mu[30], -1); // 2·3·5
  assert.equal(mu[12], 0); // 2²·3
});
