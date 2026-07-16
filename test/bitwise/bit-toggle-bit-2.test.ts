import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toggleBit } from '../../src/algorithms/bitwise/bit-toggle-bit-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-toggle-bit-2/trace.ts';
test('toggleBit 正确', () => {
  assert.equal(toggleBit(0b1010, 0), 0b1011);
  assert.equal(toggleBit(0b1010, 3), 0b0010);
  assert.equal(toggleBit(0, 5), 32);
  assert.equal(toggleBit(0xff, 7), 0x7f);
});
test('toggleBit 二次还原', () => {
  for (const x of [0b1010, 0xff])
    for (const i of [0, 3, 7]) assert.equal(toggleBit(toggleBit(x, i), i), x);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
