import { test } from 'node:test';
import assert from 'node:assert/strict';
import { secondLargest } from '../../src/algorithms/selection/second-largest/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/second-largest/trace.ts';

test('secondLargest 基本用例', () => {
  const r = secondLargest([7, 2, 9, 4, 11, 8, 5, 3]);
  assert.equal(r.largest, 11);
  assert.equal(r.second, 9);
});

test('secondLargest 最大在末尾', () => {
  const r = secondLargest([1, 2, 3, 4, 5]);
  assert.equal(r.largest, 5);
  assert.equal(r.second, 4);
});

test('secondLargest 最大在开头', () => {
  const r = secondLargest([9, 1, 2, 3, 4]);
  assert.equal(r.largest, 9);
  assert.equal(r.second, 4);
});

test('secondLargest 两个元素', () => {
  const r = secondLargest([5, 3]);
  assert.equal(r.largest, 5);
  assert.equal(r.second, 3);
});

test('secondLargest 重复最大', () => {
  const r = secondLargest([5, 5, 3, 2]);
  // 平局按 tag：tag0(5) 与 tag1(5)，冠军 tag1
  assert.equal(r.largest, 5);
  assert.equal(r.second, 5);
});

test('secondLargest 比较次数 = n + ⌈log2 n⌉ − 2', () => {
  const arr = [7, 2, 9, 4, 11, 8, 5, 3]; // n=8
  const r = secondLargest(arr);
  // n + ⌈log2 8⌉ − 2 = 8 + 3 − 2 = 9
  assert.equal(r.comparisons, 9);
});

test('secondLargest 至少需要 2 个元素', () => {
  assert.throws(() => secondLargest([1]));
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
