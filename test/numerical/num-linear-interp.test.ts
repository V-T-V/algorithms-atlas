import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lerp } from '../../src/algorithms/numerical/num-linear-interp/impl.ts';
test('中点', () => {
  assert.equal(lerp(0, 0, 10, 10, 5), 5);
});
