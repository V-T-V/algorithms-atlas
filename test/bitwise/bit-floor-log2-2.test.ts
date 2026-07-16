import { test } from 'node:test';
import assert from 'node:assert/strict';
import { floorLog2Fill } from '../../src/algorithms/bitwise/bit-floor-log2-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-floor-log2-2/trace.ts';
test('floorLog2Fill 正确', () => {
  assert.equal(floorLog2Fill(1), 0);
  assert.equal(floorLog2Fill(2), 1);
  assert.equal(floorLog2Fill(7), 2);
  assert.equal(floorLog2Fill(8), 3);
  assert.equal(floorLog2Fill(1023), 9);
  assert.equal(floorLog2Fill(1024), 10);
  assert.equal(floorLog2Fill(0), -1);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
