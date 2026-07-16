import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minMax } from '../../src/algorithms/selection/min-max-select/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/min-max-select/trace.ts';

test('minMax 正确找最小最大', () => {
  const r = minMax([3, 1, 9, 2, 8, 5, 4, 7, 6, 0]);
  assert.equal(r.min, 0);
  assert.equal(r.max, 9);
});

test('minMax 偶数个用 ⌈3n/2⌉−2 次比较', () => {
  const arr = [3, 1, 9, 2, 8, 5, 4, 7, 6, 0];
  const r = minMax(arr);
  // n=10 偶数：⌈3*10/2⌉−2 = 15−2 = 13
  assert.equal(r.comparisons, 13);
});

test('minMax 奇数个比较次数', () => {
  const arr = [3, 1, 9, 2, 8, 5, 4, 7, 6];
  const r = minMax(arr);
  // n=9 奇数：⌈3*9/2⌉−2 = 14−2 = 12
  assert.equal(r.comparisons, 12);
});

test('minMax 单元素', () => {
  const r = minMax([42]);
  assert.equal(r.min, 42);
  assert.equal(r.max, 42);
  assert.equal(r.comparisons, 0);
});

test('minMax 两个元素', () => {
  const r = minMax([5, 3]);
  assert.equal(r.min, 3);
  assert.equal(r.max, 5);
  assert.equal(r.comparisons, 1);
});

test('minMax 全等元素', () => {
  const r = minMax([7, 7, 7, 7]);
  assert.equal(r.min, 7);
  assert.equal(r.max, 7);
});

test('minMax 优于 2(n−1)', () => {
  const arr = Array.from({ length: 100 }, (_, i) => 100 - i);
  const r = minMax(arr);
  assert.ok(r.comparisons < 2 * (arr.length - 1));
});

test('minMax 空数组抛错', () => {
  assert.throws(() => minMax([]));
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
