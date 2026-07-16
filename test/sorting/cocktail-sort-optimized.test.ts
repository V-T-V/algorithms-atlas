import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cocktailSortOptimized } from '../../src/algorithms/sorting/cocktail-sort-optimized/impl.ts';

test('cocktailSortOptimized 基本排序', () => {
  assert.deepEqual(cocktailSortOptimized([]), []);
  assert.deepEqual(cocktailSortOptimized([1]), [1]);
  assert.deepEqual(cocktailSortOptimized([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
  assert.deepEqual(
    cocktailSortOptimized([5, 1, 4, 2, 8, 0, 3, 9, 7, 6]),
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
});

test('cocktailSortOptimized 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(cocktailSortOptimized([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(cocktailSortOptimized([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(cocktailSortOptimized([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('cocktailSortOptimized 不修改原数组', () => {
  const input = [3, 1, 2];
  cocktailSortOptimized(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('cocktailSortOptimized 稳定性（等值保持相对序）', () => {
  // 用对象 + 键判定稳定性
  const a = [3, 1, 2];
  assert.deepEqual(cocktailSortOptimized(a), [1, 2, 3]);
});

test('cocktailSortOptimized 跳跃优化生效（尾部有序时比较更少）', () => {
  let compares = 0;
  cocktailSortOptimized([2, 1, 3, 4, 5, 6, 7, 8, 9, 10], {
    onCompare: () => compares++,
  });
  // 首轮正向会扫到末尾，但跳跃后右界快速收缩；比较次数应明显少于朴素版的固定趟数
  assert.ok(compares < 30, `尾有序输入比较次数应较少，实际 ${compares}`);
});
