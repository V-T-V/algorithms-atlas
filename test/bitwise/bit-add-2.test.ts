import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addBit } from '../../src/algorithms/bitwise/bit-add-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-add-2/trace.ts';
test('addBit 正确', () => {
  assert.equal(addBit(13, 22), 35);
  assert.equal(addBit(0, 7), 7);
  assert.equal(addBit(255, 1), 256);
  assert.equal(addBit(-5, 3), -2);
  assert.equal(addBit(100, 200), 300);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
