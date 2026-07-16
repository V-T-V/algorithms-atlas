import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  pancakeSort,
  type PancakeSortHooks,
} from '../../src/algorithms/sorting/pancake-sort/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/sorting/pancake-sort/trace.ts';
import { meta } from '../../src/algorithms/sorting/pancake-sort/meta.ts';

const SORTED = [1, 2, 3, 4, 5, 6, 7, 8, 9];

test('pancake-sort 排序正确', () => {
  assert.deepEqual(pancakeSort([]), []);
  assert.deepEqual(pancakeSort([1]), [1]);
  assert.deepEqual(pancakeSort([2, 1]), [1, 2]);
  assert.deepEqual(pancakeSort(DEFAULT_INPUT), SORTED);
  assert.deepEqual(pancakeSort([9, 8, 7, 6, 5, 4, 3, 2, 1]), SORTED);
});

test('pancake-sort 大随机数组正确', () => {
  const big = Array.from({ length: 200 }, () => Math.floor(Math.random() * 1000));
  const expected = [...big].sort((a, b) => a - b);
  assert.deepEqual(pancakeSort(big), expected);
});

test('pancake-sort 不修改原数组', () => {
  const input = [5, 2, 8, 1, 9];
  const snapshot = [...input];
  pancakeSort(input);
  assert.deepEqual(input, snapshot);
});

test('pancake-sort 翻转次数不超过 2n', () => {
  let flips = 0;
  const hooks: PancakeSortHooks = { onFlip: () => flips++ };
  const input = [...DEFAULT_INPUT];
  pancakeSort(input, hooks);
  assert.ok(flips <= 2 * input.length, `翻转次数 ${flips} 应 ≤ 2n=${2 * input.length}`);
  assert.ok(flips > 0, '应有翻转');
});

test('pancake-sort 钩子被调用', () => {
  let finds = 0;
  let pins = 0;
  const hooks: PancakeSortHooks = {
    onFindMax: () => finds++,
    onPinned: () => pins++,
  };
  pancakeSort(DEFAULT_INPUT, hooks);
  assert.ok(finds > 0, '应查找最大值');
  // 最后一轮 hi=1 后 index 0 自然就位，不一定触发 onPinned，故 ≥ n-1
  assert.ok(pins >= DEFAULT_INPUT.length - 1, `应至少就位 n-1 个，实际 ${pins}`);
});

test('pancake-sort trace 末帧为 final 且有序', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 1);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars!.every((b) => b.role === 'final'));
  assert.deepEqual(
    last.bars!.map((b) => b.value),
    SORTED,
  );
});

test('pancake-sort meta 信息真实', () => {
  assert.equal(meta.id, 'pancake-sort');
  assert.equal(meta.categoryId, 'sorting');
  assert.ok(!meta.summary.zh.includes('待补充'));
  assert.ok(!meta.tags.includes('todo'));
  assert.equal(meta.complexity.time, 'O(n²)');
});
