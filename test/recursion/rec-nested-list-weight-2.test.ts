import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  depthSumInverse,
  findMaxDepth,
} from '../../src/algorithms/recursion/rec-nested-list-weight-2/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-nested-list-weight-2/trace.ts';

test('rec-nested-list-weight-2 经典用例', () => {
  // [[1,1],2,[1,1]]: 最大深度 2，四个 1 权重 2，一个 2 权重 1 -> 8
  assert.equal(depthSumInverse([[1, 1], 2, [1, 1]]), 8);
});

test('rec-nested-list-weight-2 单层深', () => {
  // [1,[4,[6]]]: 最大深度 3，1 权重 3，4 权重 2，6 权重 1 -> 3+8+6=17
  assert.equal(depthSumInverse([1, [4, [6]]]), 17);
});

test('rec-nested-list-weight-2 平铺全权重 1', () => {
  assert.equal(depthSumInverse([1, 2, 3]), 6);
});

test('rec-nested-list-weight-2 findMaxDepth', () => {
  assert.equal(findMaxDepth([[1, 1], 2, [1, 1]]), 2);
  assert.equal(findMaxDepth([1, [4, [6]]]), 3);
});

test('rec-nested-list-weight-2 trace', () => {
  assert.ok(buildTrace().length > 2);
});
