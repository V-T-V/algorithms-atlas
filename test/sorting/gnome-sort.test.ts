import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gnomeSort, type GnomeSortHooks } from '../../src/algorithms/sorting/gnome-sort/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/sorting/gnome-sort/trace.ts';
import { meta } from '../../src/algorithms/sorting/gnome-sort/meta.ts';

const SORTED = [1, 2, 3, 4, 5, 6, 7, 8, 9];

test('gnome-sort 排序正确', () => {
  assert.deepEqual(gnomeSort([]), []);
  assert.deepEqual(gnomeSort([1]), [1]);
  assert.deepEqual(gnomeSort([2, 1]), [1, 2]);
  assert.deepEqual(gnomeSort(DEFAULT_INPUT), SORTED);
  assert.deepEqual(gnomeSort([9, 8, 7, 6, 5, 4, 3, 2, 1]), SORTED);
});

test('gnome-sort 大随机数组正确', () => {
  const big = Array.from({ length: 200 }, () => Math.floor(Math.random() * 1000));
  const expected = [...big].sort((a, b) => a - b);
  assert.deepEqual(gnomeSort(big), expected);
});

test('gnome-sort 不修改原数组', () => {
  const input = [5, 2, 8, 1, 9];
  const snapshot = [...input];
  gnomeSort(input);
  assert.deepEqual(input, snapshot);
});

test('gnome-sort 已有序输入无交换', () => {
  let swaps = 0;
  const hooks: GnomeSortHooks = { onSwap: () => swaps++ };
  gnomeSort([1, 2, 3, 4, 5], hooks);
  assert.equal(swaps, 0, '已有序应无交换');
});

test('gnome-sort 钩子被调用', () => {
  let compares = 0;
  let moves = 0;
  const hooks: GnomeSortHooks = {
    onCompare: () => compares++,
    onMove: () => moves++,
  };
  gnomeSort(DEFAULT_INPUT, hooks);
  assert.ok(compares > 0, '应有比较');
  assert.ok(moves > 0, '应有游标移动');
});

test('gnome-sort trace 末帧为 final 且有序', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 1);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars!.every((b) => b.role === 'final'));
  assert.deepEqual(
    last.bars!.map((b) => b.value),
    SORTED,
  );
});

test('gnome-sort meta 信息真实', () => {
  assert.equal(meta.id, 'gnome-sort');
  assert.equal(meta.categoryId, 'sorting');
  assert.ok(!meta.summary.zh.includes('待补充'));
  assert.ok(!meta.tags.includes('todo'));
  assert.equal(meta.complexity.time, 'O(n²)');
});
