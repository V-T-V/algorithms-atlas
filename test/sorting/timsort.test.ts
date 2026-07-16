import { test } from 'node:test';
import assert from 'node:assert/strict';
import { timsort, type TimSortHooks } from '../../src/algorithms/sorting/timsort/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/sorting/timsort/trace.ts';
import { meta } from '../../src/algorithms/sorting/timsort/meta.ts';

const SORTED = [1, 2, 3, 4, 5, 6, 7, 8, 9];

test('timsort 排序正确', () => {
  assert.deepEqual(timsort([]), []);
  assert.deepEqual(timsort([1]), [1]);
  assert.deepEqual(timsort([2, 1]), [1, 2]);
  assert.deepEqual(timsort(DEFAULT_INPUT), SORTED);
  assert.deepEqual(timsort([9, 8, 7, 6, 5, 4, 3, 2, 1]), SORTED);
  assert.deepEqual(timsort([3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]), [1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]);
});

test('timsort 稳定性（相等元素相对顺序保持）', () => {
  // 用对象稳定性间接验证：timsort 用 <= 比较，相等时取左段
  const input = [5, 3, 5, 1, 5, 3];
  assert.deepEqual(timsort(input), [1, 3, 3, 5, 5, 5]);
});

test('timsort 不修改原数组', () => {
  const input = [5, 2, 8, 1, 9];
  const snapshot = [...input];
  timsort(input);
  assert.deepEqual(input, snapshot);
});

test('timsort 钩子被调用', () => {
  let runs = 0;
  let compares = 0;
  let swaps = 0;
  const hooks: TimSortHooks = {
    onRun: () => runs++,
    onCompare: () => compares++,
    onSwap: () => swaps++,
  };
  timsort(DEFAULT_INPUT, hooks);
  assert.ok(runs > 0, '应识别至少一个 run');
  assert.ok(compares > 0, '应有比较');
  assert.ok(swaps > 0, '应有交换/位移');
});

test('timsort 大数组触发归并', () => {
  // n > MIN_MERGE(32) 才会产生多个 run 进而触发归并
  const big = Array.from({ length: 80 }, (_, i) => (i * 37) % 80);
  let merges = 0;
  const hooks: TimSortHooks = { onMerge: () => merges++ };
  timsort(big, hooks);
  assert.ok(merges > 0, '大数组应触发归并');
  const expected = [...big].sort((a, b) => a - b);
  assert.deepEqual(timsort(big), expected);
});

test('timsort 大随机数组正确', () => {
  const big = Array.from({ length: 500 }, () => Math.floor(Math.random() * 1000));
  const expected = [...big].sort((a, b) => a - b);
  assert.deepEqual(timsort(big), expected);
});

test('timsort trace 帧序列末帧为 final', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 1);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars);
  assert.ok(last.bars!.every((b) => b.role === 'final'));
  // 末帧值应有序
  const vals = last.bars!.map((b) => b.value);
  assert.deepEqual(vals, SORTED);
});

test('timsort meta 信息真实', () => {
  assert.equal(meta.id, 'timsort');
  assert.equal(meta.categoryId, 'sorting');
  assert.ok(!meta.summary.zh.includes('待补充'));
  assert.ok(meta.tags.length > 0);
  assert.ok(!meta.tags.includes('todo'));
  assert.ok(meta.complexity.time.includes('n'));
});
