import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weightedMedianSort } from '../../src/algorithms/selection/weighted-median-sort/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/weighted-median-sort/trace.ts';

test('weightedMedianSort 基本用例', () => {
  const r = weightedMedianSort([
    { value: 5, weight: 0.1 },
    { value: 1, weight: 0.3 },
    { value: 9, weight: 0.2 },
    { value: 3, weight: 0.15 },
    { value: 7, weight: 0.25 },
  ]);
  // 总权 1.0，半 0.5；排序 [1:.3, 3:.15, 5:.1, 7:.25, 9:.2]
  // 前缀 0.3, 0.45, 0.55 → 命中 5
  assert.equal(r, 5);
});

test('weightedMedianSort 权重集中在首个', () => {
  const r = weightedMedianSort([
    { value: 10, weight: 0.9 },
    { value: 20, weight: 0.1 },
  ]);
  assert.equal(r, 10);
});

test('weightedMedianSort 权重集中在末个', () => {
  const r = weightedMedianSort([
    { value: 10, weight: 0.1 },
    { value: 20, weight: 0.9 },
  ]);
  assert.equal(r, 20);
});

test('weightedMedianSort 单元素', () => {
  assert.equal(weightedMedianSort([{ value: 7, weight: 1 }]), 7);
});

test('weightedMedianSort 整数权重', () => {
  // 权重 [1,1,1,1]，总 4，半 2；排序后第 2 个元素
  const r = weightedMedianSort([
    { value: 40, weight: 1 },
    { value: 10, weight: 1 },
    { value: 30, weight: 1 },
    { value: 20, weight: 1 },
  ]);
  assert.equal(r, 20); // [10,20,30,40] 前缀 1,2 命中 20
});

test('weightedMedianSort 负权重抛错', () => {
  assert.throws(() =>
    weightedMedianSort([
      { value: 1, weight: -1 },
      { value: 2, weight: 2 },
    ]),
  );
});

test('weightedMedianSort 空数组抛错', () => {
  assert.throws(() => weightedMedianSort([]));
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
