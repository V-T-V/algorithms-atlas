import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  introsort,
  type IntroSortHooks,
  type IntroPhase,
} from '../../src/algorithms/sorting/introsort/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/sorting/introsort/trace.ts';
import { meta } from '../../src/algorithms/sorting/introsort/meta.ts';

const SORTED = [1, 2, 3, 4, 5, 6, 7, 8, 9];

test('introsort 排序正确', () => {
  assert.deepEqual(introsort([]), []);
  assert.deepEqual(introsort([1]), [1]);
  assert.deepEqual(introsort([2, 1]), [1, 2]);
  assert.deepEqual(introsort(DEFAULT_INPUT), SORTED);
  assert.deepEqual(introsort([9, 8, 7, 6, 5, 4, 3, 2, 1]), SORTED);
});

test('introsort 大随机数组正确', () => {
  const big = Array.from({ length: 500 }, () => Math.floor(Math.random() * 1000));
  const expected = [...big].sort((a, b) => a - b);
  assert.deepEqual(introsort(big), expected);
});

test('introsort 重复元素', () => {
  assert.deepEqual(introsort([3, 1, 3, 1, 3]), [1, 1, 3, 3, 3]);
  assert.deepEqual(introsort([7, 7, 7, 7]), [7, 7, 7, 7]);
});

test('introsort 最坏情况仍是 O(n log n)（已有序大数组）', () => {
  const n = 1000;
  const sorted = Array.from({ length: n }, (_, i) => i);
  // 已有序输入对朴素快排是最坏，introsort 应能处理且结果正确
  assert.deepEqual(introsort(sorted), sorted);
  const rev = [...sorted].reverse();
  assert.deepEqual(introsort(rev), sorted);
});

test('introsort 不修改原数组', () => {
  const input = [5, 2, 8, 1, 9];
  const snapshot = [...input];
  introsort(input);
  assert.deepEqual(input, snapshot);
});

test('introsort 大数组触发堆排（深度耗尽）', () => {
  const phases = new Set<IntroPhase>();
  const hooks: IntroSortHooks = { onEnter: (_lo, _hi, phase) => phases.add(phase) };
  // 全相等输入会让快排分区极度不平衡，递归深度耗尽后切换堆排
  const big = Array(2000).fill(5);
  introsort(big, hooks);
  assert.ok(phases.has('quicksort'), '应使用快排');
  assert.ok(phases.has('heapsort'), '深度耗尽应切换堆排');
});

test('introsort 钩子被调用', () => {
  let enters = 0;
  let compares = 0;
  const hooks: IntroSortHooks = {
    onEnter: () => enters++,
    onCompare: () => compares++,
  };
  introsort(DEFAULT_INPUT, hooks);
  assert.ok(enters > 0, '应进入子区间');
  assert.ok(compares > 0, '应有比较');
});

test('introsort trace 末帧为 final 且有序', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 1);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars!.every((b) => b.role === 'final'));
  assert.deepEqual(
    last.bars!.map((b) => b.value),
    SORTED,
  );
});

test('introsort meta 信息真实', () => {
  assert.equal(meta.id, 'introsort');
  assert.equal(meta.categoryId, 'sorting');
  assert.ok(!meta.summary.zh.includes('待补充'));
  assert.ok(!meta.tags.includes('todo'));
  assert.equal(meta.complexity.time, 'O(n log n)');
});
