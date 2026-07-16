import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  binaryToDecimal,
} from '../../src/algorithms/list/list-binary-decimal-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-binary-decimal-2/trace.ts';
test('binaryToDecimal 正确', () => {
  assert.equal(binaryToDecimal(buildList([1, 0, 1, 0])), 10);
  assert.equal(binaryToDecimal(buildList([1, 1, 1])), 7);
  assert.equal(binaryToDecimal(buildList([0])), 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
