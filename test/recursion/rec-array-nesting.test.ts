import { test } from 'node:test';
import assert from 'node:assert/strict';
import { arrayNesting } from '../../src/algorithms/recursion/rec-array-nesting/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-array-nesting/trace.ts';

test('rec-array-nesting 经典用例', () => {
  // [5,4,0,3,1,6,2]: 0->5->6->2->0 环长 4
  assert.equal(arrayNesting([5, 4, 0, 3, 1, 6, 2]), 4);
});

test('rec-array-nesting 单元素自环', () => {
  assert.equal(arrayNesting([0]), 1);
});

test('rec-array-nesting 恒等排列', () => {
  assert.equal(arrayNesting([0, 1, 2, 3]), 1);
});

test('rec-array-nesting 大环', () => {
  // [1,2,3,4,0]: 0->1->2->3->4->0 环长 5
  assert.equal(arrayNesting([1, 2, 3, 4, 0]), 5);
});

test('rec-array-nesting trace', () => {
  assert.ok(buildTrace().length > 2);
});
