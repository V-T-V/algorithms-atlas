import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compactTimSort } from '../../src/algorithms/sorting/tim-sort-compact/impl.ts';

test('compactTimSort 基本排序', () => {
  assert.deepEqual(compactTimSort([]), []);
  assert.deepEqual(compactTimSort([1]), [1]);
  assert.deepEqual(compactTimSort([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
  assert.deepEqual(compactTimSort([5, 1, 9, 3, 7, 2, 8, 4, 6, 0]), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('compactTimSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(compactTimSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(compactTimSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(compactTimSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('compactTimSort 不修改原数组', () => {
  const input = [3, 1, 2];
  compactTimSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('compactTimSort 自适应：部分有序段被识别', () => {
  let runCount = 0;
  // 需 > MIN_MERGE(16) 才会出现多个 run
  compactTimSort([1, 2, 3, 5, 4, 6, 8, 7, 9, 10, 12, 11, 13, 15, 14, 16, 18, 17, 20, 19], {
    onRun: () => runCount++,
  });
  assert.ok(runCount >= 2, '应识别出多个自然 run');
});

test('compactTimSort 大随机数组正确', () => {
  const big = Array.from({ length: 500 }, (_, i) => ((i * 1103515245 + 12345) & 0x7fffffff) % 1000);
  const expected = [...big].sort((x, y) => x - y);
  assert.deepEqual(compactTimSort(big), expected);
});
