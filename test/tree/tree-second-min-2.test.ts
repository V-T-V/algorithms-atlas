import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTree,
  findSecondMinimumValue,
} from '../../src/algorithms/tree/tree-second-min-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-second-min-2/trace.ts';
test('findSecondMinimumValue 正确', () => {
  assert.equal(findSecondMinimumValue(buildTree([2, 2, 5, null, null, 5, 7])), 5);
  assert.equal(findSecondMinimumValue(buildTree([2, 2, 2])), -1);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
