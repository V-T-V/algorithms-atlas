import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pigeonholeSort } from '../../src/algorithms/sorting/pigeonhole-sort/impl.ts';

test('pigeonholeSort 基本排序', () => {
  assert.deepEqual(pigeonholeSort([]), []);
  assert.deepEqual(pigeonholeSort([1]), [1]);
  assert.deepEqual(pigeonholeSort([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
  assert.deepEqual(pigeonholeSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('pigeonholeSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(pigeonholeSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(pigeonholeSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(pigeonholeSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('pigeonholeSort 不修改原数组', () => {
  const input = [3, 1, 2];
  pigeonholeSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('pigeonholeSort 钩子被调用', () => {
  let places = 0;
  let collects = 0;
  pigeonholeSort([3, 1, 2], {
    onPlace: () => places++,
    onCollect: () => collects++,
  });
  assert.equal(places, 3, '每个元素入巢一次');
  assert.equal(collects, 3, '每个元素回收一次');
});
