import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  weightedMedian,
  type WeightedItem,
} from '../../src/algorithms/selection/weighted-median/impl.ts';

test('weightedMedian 基本断言', () => {
  const items: WeightedItem[] = [
    { value: 1, weight: 1 },
    { value: 2, weight: 2 },
    { value: 3, weight: 3 },
    { value: 4, weight: 4 },
    { value: 5, weight: 1 },
  ];
  // 总权重 11，半阈值 5.5；累计 1+2+3=6 >= 5.5，命中 value=3
  assert.equal(weightedMedian(items), 3);
});

test('weightedMedian 单元素', () => {
  assert.equal(weightedMedian([{ value: 7, weight: 5 }]), 7);
});

test('weightedMedian 等权退化为普通中位数', () => {
  // 五项等权，普通中位数（升序后中间值）= 3
  const items: WeightedItem[] = [
    { value: 5, weight: 1 },
    { value: 1, weight: 1 },
    { value: 3, weight: 1 },
    { value: 2, weight: 1 },
    { value: 4, weight: 1 },
  ];
  assert.equal(weightedMedian(items), 3);
});

test('weightedMedian 大权重偏向某项', () => {
  // value=9 权重 100 远大于其他；累计到它必跨阈值
  const items: WeightedItem[] = [
    { value: 1, weight: 1 },
    { value: 9, weight: 100 },
    { value: 2, weight: 1 },
  ];
  assert.equal(weightedMedian(items), 9);
});

test('weightedMedian 空数组抛错', () => {
  assert.throws(() => weightedMedian([]));
});

test('weightedMedian 钩子被调用', () => {
  const items: WeightedItem[] = [
    { value: 1, weight: 1 },
    { value: 2, weight: 2 },
    { value: 3, weight: 1 },
  ];
  let accCount = 0;
  let found = -1;
  weightedMedian(items, {
    onAccumulate: () => accCount++,
    onFound: (v) => (found = v),
  });
  assert.ok(accCount > 0, '应有累加事件');
  assert.equal(found, 2);
});
