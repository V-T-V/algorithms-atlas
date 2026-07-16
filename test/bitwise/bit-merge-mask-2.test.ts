import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeMask } from '../../src/algorithms/bitwise/bit-merge-mask-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-merge-mask-2/trace.ts';
test('mergeMask 正确', () => {
  assert.equal(mergeMask(0xff, 0x00, 0x0f), 0x0f);
  assert.equal(mergeMask(0b1010, 0b0101, 0b1100), 0b1001);
  assert.equal(mergeMask(0xff, 0xaa, 0x00), 0xaa);
  assert.equal(mergeMask(0xff, 0xaa, 0xff), 0xff);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
