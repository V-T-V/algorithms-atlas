import { test } from 'node:test';
import assert from 'node:assert/strict';
import { heapselect } from '../../src/algorithms/selection/heapselect/impl.ts';

test('heapselect 基本选择', () => {
  const arr = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  assert.equal(heapselect(arr, 1), 1);
  assert.equal(heapselect(arr, 5), 5);
  assert.equal(heapselect(arr, 9), 9);
});

test('heapselect 与排序一致', () => {
  const arr = [7, 3, 9, 1, 5, 8, 2, 6, 4, 0];
  const sorted = [...arr].sort((a, b) => a - b);
  for (let k = 1; k <= arr.length; k++) {
    assert.equal(heapselect(arr, k), sorted[k - 1], `k=${k} 应为 ${sorted[k - 1]}`);
  }
});

test('heapselect 不修改原数组', () => {
  const input = [3, 1, 2];
  heapselect(input, 1);
  assert.deepEqual(input, [3, 1, 2]);
});

test('heapselect 越界抛错', () => {
  assert.throws(() => heapselect([1, 2], 0));
  assert.throws(() => heapselect([1, 2], 3));
});

test('heapselect 钩子被调用', () => {
  const arr = [9, 4, 7, 2, 5];
  const pushes: number[] = [];
  const pops: number[] = [];
  // 排序后 [2,4,5,7,9]，第 2 小 = 4
  const result = heapselect(arr, 2, {
    onPush: (idx) => pushes.push(idx),
    onPop: (idx) => pops.push(idx),
    onDone: (k, v) => assert.equal(v, 4),
  });
  assert.equal(result, 4);
  assert.ok(pushes.length > 0, '应有 push');
});
