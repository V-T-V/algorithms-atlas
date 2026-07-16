import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countBlocks } from '../../src/algorithms/bitwise/bit-count-blocks-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-count-blocks-2/trace.ts';
test('countBlocks 正确', () => {
  assert.equal(countBlocks(0b110011), 2);
  assert.equal(countBlocks(0b10101), 3);
  assert.equal(countBlocks(0b111), 1);
  assert.equal(countBlocks(0), 0);
  assert.equal(countBlocks(0xffffffff), 1);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
