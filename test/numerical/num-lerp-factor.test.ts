import { test } from 'node:test';
import assert from 'node:assert/strict';
import { invLerp } from '../../src/algorithms/numerical/num-lerp-factor/impl.ts';
test('中点=0.5', () => {
  assert.equal(invLerp(0, 10, 5), 0.5);
});
