import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findMinSteps } from '../../src/algorithms/dp/dp-super-wash-2/impl.ts';

test('super-wash LC517 例1', () => {
  assert.equal(findMinSteps([1, 0, 5]), 3);
});

test('super-wash LC517 例2', () => {
  assert.equal(findMinSteps([0, 3, 0]), 2);
});

test('super-wash 已相等', () => {
  assert.equal(findMinSteps([2, 2, 2]), 0);
});

test('super-wash 不能整除', () => {
  assert.equal(findMinSteps([1, 0, 4]), -1);
});
