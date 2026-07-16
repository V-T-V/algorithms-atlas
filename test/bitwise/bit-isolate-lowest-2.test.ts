import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isolateLowestBit } from '../../src/algorithms/bitwise/bit-isolate-lowest-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-isolate-lowest-2/trace.ts';
test('isolateLowestBit 正确', () => {
  assert.equal(isolateLowestBit(0b00110010), 0b00000010);
  assert.equal(isolateLowestBit(0b10000000), 0b10000000);
  assert.equal(isolateLowestBit(0b00010001), 1);
  assert.equal(isolateLowestBit(0), 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
