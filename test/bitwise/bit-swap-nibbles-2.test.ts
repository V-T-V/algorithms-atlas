import { test } from 'node:test';
import assert from 'node:assert/strict';
import { swapNibbles } from '../../src/algorithms/bitwise/bit-swap-nibbles-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-swap-nibbles-2/trace.ts';
test('swapNibbles 正确', () => {
  assert.equal(swapNibbles(0xab), 0xba);
  assert.equal(swapNibbles(0x12), 0x21);
  assert.equal(swapNibbles(0xf0), 0x0f);
  assert.equal(swapNibbles(0x0f), 0xf0);
});
test('swapNibbles 自逆', () => {
  for (const x of [0xab, 0x12, 0xf0]) assert.equal(swapNibbles(swapNibbles(x)), x);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
