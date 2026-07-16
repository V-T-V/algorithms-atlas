import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binaryStrings } from '../../src/algorithms/backtracking/bt-binary-strings/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-binary-strings/trace.ts';
test('binaryStrings 正确', () => {
  assert.equal(binaryStrings(3).length, 8);
  assert.ok(binaryStrings(2).includes('10'));
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
