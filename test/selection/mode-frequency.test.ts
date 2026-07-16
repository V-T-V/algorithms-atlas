import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  majorityElement,
  findMajority,
} from '../../src/algorithms/selection/mode-frequency/impl.ts';

test('majorityElement 有主元素', () => {
  assert.equal(majorityElement([3, 2, 3]), 3);
  assert.equal(majorityElement([2, 2, 1, 1, 2, 2, 2]), 2);
});

test('majorityElement 单元素', () => {
  assert.equal(majorityElement([42]), 42);
});

test('majorityElement 全相同', () => {
  assert.equal(majorityElement([5, 5, 5, 5]), 5);
});

test('majorityElement 经典 LeetCode 用例', () => {
  // [3,3,4,2,4,4,2,4,4] 多数为 4
  assert.equal(majorityElement([3, 3, 4, 2, 4, 4, 2, 4, 4]), 4);
});

test('findMajority 存在返回值', () => {
  assert.equal(findMajority([1, 1, 2, 1]), 1);
});

test('findMajority 不存在返回 null', () => {
  // [1,2,3] 无主元素
  assert.equal(findMajority([1, 2, 3]), null);
  assert.equal(findMajority([1, 1, 2, 2]), null);
});

test('findMajority 空数组返回 null', () => {
  assert.equal(findMajority([]), null);
});

test('majorityElement 钩子被调用', () => {
  let changes = 0;
  let lastCandidate = -1;
  majorityElement([3, 3, 4, 3], {
    onCandidateChange: (v) => {
      changes++;
      lastCandidate = v;
    },
    onDone: (c) => (lastCandidate = c),
  });
  assert.ok(changes > 0, 'candidate 应至少变化一次');
  assert.equal(lastCandidate, 3);
});
