import { test } from 'node:test';
import assert from 'node:assert/strict';
import { superWashingMachines } from '../../src/algorithms/dp/dp-super-washing/impl.ts';

test('super-wash LeetCode 517 例 1', () => {
  assert.equal(superWashingMachines([1, 0, 5]), 3);
});

test('super-wash LeetCode 517 例 2', () => {
  assert.equal(superWashingMachines([0, 3, 0]), 2);
});

test('super-wash 已相等', () => {
  assert.equal(superWashingMachines([2, 2, 2]), 0);
});

test('super-wash 无解', () => {
  assert.equal(superWashingMachines([1, 0, 4]), -1);
});

test('super-wash 单台', () => {
  assert.equal(superWashingMachines([5]), 0);
});
