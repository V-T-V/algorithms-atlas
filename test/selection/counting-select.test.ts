import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countingSelect } from '../../src/algorithms/selection/counting-select/impl.ts';

test('countingSelect 基本选择', () => {
  const arr = [3, 1, 4, 1, 5, 9, 2, 6];
  const sorted = [...arr].sort((a, b) => a - b);
  for (let kk = 0; kk < arr.length; kk++) {
    assert.equal(countingSelect(arr, kk), sorted[kk]);
  }
});

test('countingSelect 重复元素', () => {
  const arr = [5, 5, 5, 1, 1, 9];
  const sorted = [...arr].sort((a, b) => a - b);
  for (let kk = 0; kk < arr.length; kk++) {
    assert.equal(countingSelect(arr, kk), sorted[kk]);
  }
});

test('countingSelect 含 0 值', () => {
  assert.equal(countingSelect([0, 2, 0, 1], 0), 0);
  assert.equal(countingSelect([0, 2, 0, 1], 1), 0);
  assert.equal(countingSelect([0, 2, 0, 1], 3), 2);
});

test('countingSelect 不修改原数组', () => {
  const input = [3, 1, 2];
  countingSelect(input, 0);
  assert.deepEqual(input, [3, 1, 2]);
});

test('countingSelect 越界抛错', () => {
  assert.throws(() => countingSelect([1], -1));
  assert.throws(() => countingSelect([1], 1));
});

test('countingSelect 非整数/负数抛错', () => {
  assert.throws(() => countingSelect([1.5, 2], 0));
  assert.throws(() => countingSelect([-1, 2], 0));
});
