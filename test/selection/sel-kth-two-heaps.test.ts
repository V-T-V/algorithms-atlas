import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TwoHeapMedian,
  runningMedian,
} from '../../src/algorithms/selection/sel-kth-two-heaps/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-kth-two-heaps/trace.ts';

test('sel-kth-two-heaps 流式中位数', () => {
  assert.deepEqual(runningMedian([1, 2, 3]), [1, 1.5, 2]);
});

test('sel-kth-two-heaps 偶数取平均', () => {
  assert.deepEqual(runningMedian([5, 2, 8, 1]), [5, 3.5, 5, 3.5]);
});

test('sel-kth-two-heaps 单元素', () => {
  const th = new TwoHeapMedian();
  th.insert(42);
  assert.equal(th.median(), 42);
});

test('sel-kth-two-heaps 空 median 抛错', () => {
  const th = new TwoHeapMedian();
  assert.throws(() => th.median());
});

test('sel-kth-two-heaps trace', () => {
  assert.ok(buildTrace().length > 2);
});
