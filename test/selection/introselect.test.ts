import { test } from 'node:test';
import assert from 'node:assert/strict';
import { introselect } from '../../src/algorithms/selection/introselect/impl.ts';

test('introselect 基本选择', () => {
  const arr = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  assert.equal(introselect(arr, 0, 1), 1);
  assert.equal(introselect(arr, 4, 1), 5);
  assert.equal(introselect(arr, 8, 1), 9);
});

test('introselect 与排序一致（多种种子）', () => {
  const arr = [7, 3, 9, 1, 5, 8, 2, 6, 4, 0, 11, 13];
  const sorted = [...arr].sort((a, b) => a - b);
  for (const seed of [1, 2, 7, 42]) {
    for (let kk = 0; kk < arr.length; kk++) {
      assert.equal(introselect(arr, kk, seed), sorted[kk], `seed=${seed} k=${kk}`);
    }
  }
});

test('introselect 已序输入不退化', () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const sorted = [...arr];
  for (let kk = 0; kk < arr.length; kk++) {
    assert.equal(introselect(arr, kk, 1), sorted[kk]);
  }
});

test('introselect 重复元素', () => {
  const arr = [4, 4, 4, 1, 2, 2];
  const sorted = [...arr].sort((a, b) => a - b);
  for (let kk = 0; kk < arr.length; kk++) {
    assert.equal(introselect(arr, kk, 1), sorted[kk]);
  }
});

test('introselect 不修改原数组', () => {
  const input = [3, 1, 2];
  introselect(input, 0);
  assert.deepEqual(input, [3, 1, 2]);
});

test('introselect 越界抛错', () => {
  assert.throws(() => introselect([1], -1));
  assert.throws(() => introselect([1], 1));
});
