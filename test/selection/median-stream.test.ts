import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MedianFinder } from '../../src/algorithms/selection/median-stream/impl.ts';

test('MedianFinder 奇数个元素', () => {
  const mf = new MedianFinder();
  for (const n of [2, 5, 1]) mf.addNum(n);
  // 已加入 {1,2,5}，中位数 2
  assert.equal(mf.findMedian(), 2);
});

test('MedianFinder 偶数个元素', () => {
  const mf = new MedianFinder();
  for (const n of [1, 2, 3, 4]) mf.addNum(n);
  // {1,2,3,4}，中位数 (2+3)/2 = 2.5
  assert.equal(mf.findMedian(), 2.5);
});

test('MedianFinder 逐个添加验证', () => {
  const mf = new MedianFinder();
  mf.addNum(1);
  assert.equal(mf.findMedian(), 1);
  mf.addNum(2);
  assert.equal(mf.findMedian(), 1.5);
  mf.addNum(3);
  assert.equal(mf.findMedian(), 2);
  mf.addNum(4);
  assert.equal(mf.findMedian(), 2.5);
  mf.addNum(5);
  assert.equal(mf.findMedian(), 3);
});

test('MedianFinder 乱序输入与排序一致', () => {
  const input = [9, 3, 7, 1, 8, 2, 6, 4, 5, 0];
  const mf = new MedianFinder();
  for (let i = 0; i < input.length; i++) {
    mf.addNum(input[i]!);
    const seen = input.slice(0, i + 1).sort((a, b) => a - b);
    const k = seen.length;
    const expected = k % 2 === 1 ? seen[(k - 1) / 2]! : (seen[k / 2 - 1]! + seen[k / 2]!) / 2;
    assert.equal(mf.findMedian(), expected, `i=${i} median mismatch`);
  }
});

test('MedianFinder 负数', () => {
  const mf = new MedianFinder();
  for (const n of [-1, -2, -3, -4]) mf.addNum(n);
  assert.equal(mf.findMedian(), -2.5);
});

test('MedianFinder 钩子被调用', () => {
  let queries = 0;
  let balances = 0;
  const mf = new MedianFinder({
    onBalance: () => balances++,
    onQuery: () => queries++,
  });
  mf.addNum(1);
  mf.addNum(2);
  mf.findMedian();
  assert.equal(balances, 2);
  assert.equal(queries, 1);
});

test('MedianFinder total 计数', () => {
  const mf = new MedianFinder();
  for (const n of [1, 2, 3]) mf.addNum(n);
  assert.equal(mf.total, 3);
});
