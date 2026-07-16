import { test } from 'node:test';
import assert from 'node:assert/strict';
import { optimizedBubbleSort } from '../../src/algorithms/sorting/bubble-sort-optimized/impl.ts';

test('optimizedBubbleSort 基本排序', () => {
  assert.deepEqual(optimizedBubbleSort([]), []);
  assert.deepEqual(optimizedBubbleSort([1]), [1]);
  assert.deepEqual(optimizedBubbleSort([2, 1]), [1, 2]);
  assert.deepEqual(optimizedBubbleSort([5, 1, 2, 3, 4, 9, 8, 7, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('optimizedBubbleSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(optimizedBubbleSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(optimizedBubbleSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(optimizedBubbleSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('optimizedBubbleSort 已有序时触发提前终止', () => {
  let earlyExit = false;
  let swaps = 0;
  optimizedBubbleSort([1, 2, 3, 4, 5], {
    onSwap: () => swaps++,
    onEarlyExit: () => {
      earlyExit = true;
    },
  });
  assert.equal(swaps, 0, '有序数组不应发生交换');
  assert.ok(earlyExit, '应触发提前终止');
});

test('optimizedBubbleSort 不修改原数组', () => {
  const input = [3, 1, 2];
  optimizedBubbleSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('optimizedBubbleSort 钩子被调用', () => {
  let compares = 0;
  let lastSwapCalls = 0;
  optimizedBubbleSort([3, 2, 1], {
    onCompare: () => compares++,
    onLastSwap: () => lastSwapCalls++,
  });
  assert.ok(compares > 0, '应发生至少一次比较');
  assert.ok(lastSwapCalls > 0, '应记录最后交换位置');
});
