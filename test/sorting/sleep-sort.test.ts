import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sleepSort } from '../../src/algorithms/sorting/sleep-sort/impl.ts';

test('sleepSort 基本排序', () => {
  assert.deepEqual(sleepSort([]), []);
  assert.deepEqual(sleepSort([1]), [1]);
  assert.deepEqual(sleepSort([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
  assert.deepEqual(sleepSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('sleepSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(sleepSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(sleepSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(sleepSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('sleepSort 拒绝非正数', () => {
  assert.throws(() => sleepSort([0, 1]), RangeError);
  assert.throws(() => sleepSort([-1, 2]), RangeError);
});

test('sleepSort 不修改原数组', () => {
  const input = [3, 1, 2];
  sleepSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('sleepSort 钩子被调用', () => {
  let timers = 0;
  let wakes = 0;
  sleepSort([3, 1, 2], {
    onStartTimer: () => timers++,
    onWake: () => wakes++,
  });
  assert.equal(timers, 3, '每个元素启动一个计时器');
  assert.equal(wakes, 3, '每个元素被唤醒一次');
});
