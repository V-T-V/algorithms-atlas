import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BubbleSort,
  SelectionSort,
  InsertionSort,
  SortContext,
} from '../../src/algorithms/design/design-strategy/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-strategy/trace.ts';

test('strategy bubble 排序正确', () => {
  const ctx = new SortContext(new BubbleSort());
  assert.deepEqual(ctx.sort([3, 1, 2]), [1, 2, 3]);
});
test('strategy selection 排序正确', () => {
  const ctx = new SortContext(new SelectionSort());
  assert.deepEqual(ctx.sort([3, 1, 2]), [1, 2, 3]);
});
test('strategy insertion 排序正确', () => {
  const ctx = new SortContext(new InsertionSort());
  assert.deepEqual(ctx.sort([3, 1, 2]), [1, 2, 3]);
});
test('strategy 运行时切换', () => {
  const ctx = new SortContext(new BubbleSort());
  assert.equal(ctx.getStrategyName(), 'bubble');
  ctx.setStrategy(new SelectionSort());
  assert.equal(ctx.getStrategyName(), 'selection');
  assert.deepEqual(ctx.sort([5, 4, 3]), [3, 4, 5]);
});
test('strategy 不修改原数组', () => {
  const ctx = new SortContext(new BubbleSort());
  const orig = [3, 1, 2];
  ctx.sort(orig);
  assert.deepEqual(orig, [3, 1, 2]);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
