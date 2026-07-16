import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectBit } from '../../src/algorithms/bitwise/bit-cond-move-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-cond-move-2/trace.ts';
test('selectBit 正确', () => {
  assert.equal(selectBit(true, 0xaa, 0x55), 0xaa);
  assert.equal(selectBit(false, 0xaa, 0x55), 0x55);
  assert.equal(selectBit(true, 100, 200), 100);
  assert.equal(selectBit(false, 100, 200), 200);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
