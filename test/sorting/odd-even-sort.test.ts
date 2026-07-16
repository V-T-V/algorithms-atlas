import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  oddEvenSort,
  type OddEvenSortHooks,
} from '../../src/algorithms/sorting/odd-even-sort/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/sorting/odd-even-sort/trace.ts';
import { meta } from '../../src/algorithms/sorting/odd-even-sort/meta.ts';

const SORTED = [1, 2, 3, 4, 5, 6, 7, 8, 9];

test('odd-even-sort 排序正确', () => {
  assert.deepEqual(oddEvenSort([]), []);
  assert.deepEqual(oddEvenSort([1]), [1]);
  assert.deepEqual(oddEvenSort([2, 1]), [1, 2]);
  assert.deepEqual(oddEvenSort(DEFAULT_INPUT), SORTED);
  assert.deepEqual(oddEvenSort([9, 8, 7, 6, 5, 4, 3, 2, 1]), SORTED);
});

test('odd-even-sort 大随机数组正确', () => {
  const big = Array.from({ length: 200 }, () => Math.floor(Math.random() * 1000));
  const expected = [...big].sort((a, b) => a - b);
  assert.deepEqual(oddEvenSort(big), expected);
});

test('odd-even-sort 不修改原数组', () => {
  const input = [5, 2, 8, 1, 9];
  const snapshot = [...input];
  oddEvenSort(input);
  assert.deepEqual(input, snapshot);
});

test('odd-even-sort 已有序输入一次通过即结束', () => {
  let passes = 0;
  const hooks: OddEvenSortHooks = { onPhase: () => passes++ };
  oddEvenSort([1, 2, 3, 4, 5], hooks);
  // 已有序：偶数阶段 + 奇数阶段后 sorted 仍为 true，共 2 个 phase
  assert.equal(passes, 2);
});

test('odd-even-sort 钩子被调用', () => {
  let compares = 0;
  let swaps = 0;
  const hooks: OddEvenSortHooks = {
    onCompare: () => compares++,
    onSwap: () => swaps++,
  };
  oddEvenSort(DEFAULT_INPUT, hooks);
  assert.ok(compares > 0, '应有比较');
  assert.ok(swaps > 0, '应有交换');
});

test('odd-even-sort trace 末帧为 final 且有序', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 1);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars!.every((b) => b.role === 'final'));
  assert.deepEqual(
    last.bars!.map((b) => b.value),
    SORTED,
  );
});

test('odd-even-sort meta 信息真实', () => {
  assert.equal(meta.id, 'odd-even-sort');
  assert.equal(meta.categoryId, 'sorting');
  assert.ok(!meta.summary.zh.includes('待补充'));
  assert.ok(!meta.tags.includes('todo'));
  assert.equal(meta.complexity.time, 'O(n²)');
});
