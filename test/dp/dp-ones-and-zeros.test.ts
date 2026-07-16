import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onesAndZeros } from '../../src/algorithms/dp/dp-ones-and-zeros/impl.ts';

test('ones-and-zeros LeetCode 474 例 1', () => {
  assert.equal(onesAndZeros(['10', '0001', '111001', '1', '0'], 5, 3), 4);
});

test('ones-and-zeros LeetCode 474 例 2', () => {
  assert.equal(onesAndZeros(['10', '0', '1'], 1, 1), 2);
});

test('ones-and-zeros 零容量', () => {
  assert.equal(onesAndZeros(['10', '11'], 0, 0), 0);
});

test('ones-and-zeros 空数组', () => {
  assert.equal(onesAndZeros([], 5, 5), 0);
});

test('ones-and-zeros 全可取', () => {
  assert.equal(onesAndZeros(['0', '1', '0'], 2, 1), 3);
});

test('ones-and-zeros 钩子', () => {
  let items = 0;
  onesAndZeros(['10', '01'], 2, 2, { onItem: () => items++ });
  assert.equal(items, 2);
});
