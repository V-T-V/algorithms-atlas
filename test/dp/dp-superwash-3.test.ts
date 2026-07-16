import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findMinMoves } from '../../src/algorithms/dp/dp-superwash-3/impl.ts';

test('wash 经典', () => {
  assert.equal(findMinMoves([1, 0, 5]), 3);
});
test('wash 均衡', () => {
  assert.equal(findMinMoves([0, 0, 0]), 0);
});
test('wash 不可行', () => {
  assert.equal(findMinMoves([1, 0, 4]), -1);
});
