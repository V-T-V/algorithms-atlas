import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spaghettiSort } from '../../src/algorithms/sorting/spaghetti-sort/impl.ts';

test('spaghettiSort 基本排序', () => {
  assert.deepEqual(spaghettiSort([]), []);
  assert.deepEqual(spaghettiSort([1]), [1]);
  assert.deepEqual(spaghettiSort([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
  assert.deepEqual(spaghettiSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('spaghettiSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(spaghettiSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(spaghettiSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(spaghettiSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('spaghettiSort 不修改原数组', () => {
  const input = [3, 1, 2];
  spaghettiSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('spaghettiSort 钩子被调用', () => {
  let places = 0;
  let picks = 0;
  spaghettiSort([3, 1, 2], {
    onPlaceRod: () => places++,
    onPickRod: () => picks++,
  });
  assert.equal(places, 3, '每根面条放一次');
  assert.equal(picks, 3, '每根面条取一次');
});
