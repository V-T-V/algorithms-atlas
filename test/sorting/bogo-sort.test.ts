import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bogoSort } from '../../src/algorithms/sorting/bogo-sort/impl.ts';

test('bogoSort 基本排序（小输入）', () => {
  assert.deepEqual(bogoSort([]), []);
  assert.deepEqual(bogoSort([1]), [1]);
  assert.deepEqual(bogoSort([3, 1, 2]), [1, 2, 3]);
  assert.deepEqual(bogoSort([4, 2, 1, 3]), [1, 2, 3, 4]);
});

test('bogoSort 已有序 / 逆序', () => {
  assert.deepEqual(bogoSort([1, 2, 3]), [1, 2, 3]);
  assert.deepEqual(bogoSort([3, 2, 1]), [1, 2, 3]);
});

test('bogoSort 不修改原数组', () => {
  const input = [3, 1, 2];
  bogoSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('bogoSort 钩子被调用', () => {
  let shuffles = 0;
  let checks = 0;
  bogoSort([3, 2, 1], {
    onShuffle: () => shuffles++,
    onCheck: () => checks++,
  });
  assert.ok(shuffles >= 1, '应至少洗牌一次');
  assert.ok(checks >= 2, '应至少检查两次');
});
