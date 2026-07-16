import { test } from 'node:test';
import assert from 'node:assert/strict';
import { geometricSum } from '../../src/algorithms/numerical/num-geometric-sum/impl.ts';
test('1+2+4+8+16=31', () => {
  assert.equal(geometricSum(2, 5), 31);
});
test('r=1', () => {
  assert.equal(geometricSum(1, 5), 5);
});
