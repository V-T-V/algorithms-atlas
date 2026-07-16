import { test } from 'node:test';
import assert from 'node:assert/strict';
import { floorLog2, clz32 } from '../../src/algorithms/bitwise/bit-log2-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-log2-2/trace.ts';
test('floorLog2 正确', () => {
  assert.equal(floorLog2(1), 0);
  assert.equal(floorLog2(2), 1);
  assert.equal(floorLog2(3), 1);
  assert.equal(floorLog2(7), 2);
  assert.equal(floorLog2(8), 3);
  assert.equal(floorLog2(1023), 9);
  assert.equal(floorLog2(1024), 10);
  assert.equal(floorLog2(0), -1);
});
test('clz32 与原生一致', () => {
  for (const x of [0, 1, 2, 15, 16, 255, 256, 0xffffffff]) assert.equal(clz32(x), Math.clz32(x));
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
