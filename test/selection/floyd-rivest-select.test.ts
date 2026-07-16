import { test } from 'node:test';
import assert from 'node:assert/strict';
import { floydRivestSelect } from '../../src/algorithms/selection/floyd-rivest-select/impl.ts';

test('floydRivestSelect 基本选择', () => {
  const arr = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  assert.equal(floydRivestSelect(arr, 0, 1), 1);
  assert.equal(floydRivestSelect(arr, 4, 1), 5);
  assert.equal(floydRivestSelect(arr, 8, 1), 9);
});

test('floydRivestSelect 与排序一致（多种种子）', () => {
  const arr = [7, 3, 9, 1, 5, 8, 2, 6, 4, 0, 11, 13];
  const sorted = [...arr].sort((a, b) => a - b);
  for (const seed of [1, 2, 7, 42]) {
    for (let kk = 0; kk < arr.length; kk++) {
      assert.equal(floydRivestSelect(arr, kk, seed), sorted[kk], `seed=${seed} k=${kk}`);
    }
  }
});

test('floydRivestSelect 重复元素', () => {
  const arr = [4, 4, 4, 1, 2, 2, 4, 1];
  const sorted = [...arr].sort((a, b) => a - b);
  for (let kk = 0; kk < arr.length; kk++) {
    assert.equal(floydRivestSelect(arr, kk, 1), sorted[kk]);
  }
});

test('floydRivestSelect 不修改原数组', () => {
  const input = [3, 1, 2];
  floydRivestSelect(input, 0);
  assert.deepEqual(input, [3, 1, 2]);
});

test('floydRivestSelect 越界抛错', () => {
  assert.throws(() => floydRivestSelect([1], -1));
  assert.throws(() => floydRivestSelect([1], 1));
});
