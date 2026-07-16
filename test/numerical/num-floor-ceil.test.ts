import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ceil } from '../../src/algorithms/numerical/num-floor-ceil/impl.ts';
test('ceil(2.3)=3', () => {
  assert.equal(ceil(2.3), 3);
});
