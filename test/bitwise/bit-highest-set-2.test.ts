import { test } from 'node:test';
import assert from 'node:assert/strict';
import { highestSetBit } from '../../src/algorithms/bitwise/bit-highest-set-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-highest-set-2/trace.ts';
test('highestSetBit 正确', () => {
  assert.equal(highestSetBit(1), 1);
  assert.equal(highestSetBit(5), 4);
  assert.equal(highestSetBit(16), 16);
  assert.equal(highestSetBit(255), 128);
  assert.equal(highestSetBit(1000), 512);
  assert.equal(highestSetBit(0), 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
