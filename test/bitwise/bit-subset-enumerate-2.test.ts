import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enumerateSubsets } from '../../src/algorithms/bitwise/bit-subset-enumerate-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-subset-enumerate-2/trace.ts';
test('enumerateSubsets 正确', () => {
  assert.deepEqual(enumerateSubsets(0b101), [0b101, 0b100, 0b001]);
  assert.deepEqual(enumerateSubsets(0b111).length, 7);
  assert.deepEqual(enumerateSubsets(0), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
