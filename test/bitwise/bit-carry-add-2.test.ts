import { test } from 'node:test';
import assert from 'node:assert/strict';
import { carryPropagate } from '../../src/algorithms/bitwise/bit-carry-add-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-carry-add-2/trace.ts';
test('carryPropagate 正确', () => {
  assert.deepEqual(carryPropagate([2, 2, 0, 0]), [0, 0, 1, 0]);
  assert.deepEqual(carryPropagate([1, 1, 0, 0]), [1, 1, 0, 0]);
  assert.deepEqual(carryPropagate([3, 0, 0, 0]), [1, 1, 0, 0]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
