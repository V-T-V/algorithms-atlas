import { test } from 'node:test';
import assert from 'node:assert/strict';
import { popcountTbl } from '../../src/algorithms/bitwise/bit-popcount-3/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-popcount-3/trace.ts';
test('popcountTbl 正确', () => {
  assert.equal(popcountTbl(0), 0);
  assert.equal(popcountTbl(7), 3);
  assert.equal(popcountTbl(255), 8);
  assert.equal(popcountTbl(256), 1);
  assert.equal(popcountTbl(0x10101010), 4);
  assert.equal(popcountTbl(0xffffffff), 32);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
