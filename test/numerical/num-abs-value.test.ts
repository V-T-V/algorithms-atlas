import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abs, sign } from '../../src/algorithms/numerical/num-abs-value/impl.ts';
test('abs(-7)=7', () => {
  assert.equal(abs(-7), 7);
});
test('sign', () => {
  assert.equal(sign(-3), -1);
  assert.equal(sign(0), 0);
  assert.equal(sign(5), 1);
});
