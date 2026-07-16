import { test } from 'node:test';
import assert from 'node:assert/strict';
import { arithmeticSum } from '../../src/algorithms/numerical/num-arithmetic-sum/impl.ts';
test('1+...+100=5050', () => {
  assert.equal(arithmeticSum(1, 1, 100), 5050);
});
