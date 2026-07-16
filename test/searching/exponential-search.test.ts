import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exponentialSearch } from '../../src/algorithms/searching/exponential-search/impl.ts';

const A = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

test('exponentialSearch 命中与未命中', () => {
  assert.equal(exponentialSearch(A, 18), 8);
  assert.equal(exponentialSearch(A, 2), 0); // 首元素（特判）
  assert.equal(exponentialSearch(A, 30), 14); // 末元素
  assert.equal(exponentialSearch(A, 16), 7);
  assert.equal(exponentialSearch(A, 17), -1); // 不存在（在范围内）
  assert.equal(exponentialSearch(A, 1), -1); // 比所有都小
  assert.equal(exponentialSearch(A, 999), -1); // 比所有都大
});

test('exponentialSearch 边界', () => {
  assert.equal(exponentialSearch([], 1), -1); // 空数组
  assert.equal(exponentialSearch([5], 5), 0); // 单元素命中
  assert.equal(exponentialSearch([5], 3), -1); // 单元素未命中
  assert.equal(exponentialSearch([1, 2], 1), 0);
  assert.equal(exponentialSearch([1, 2], 2), 1);
});

test('exponentialSearch 重复元素', () => {
  const a = [1, 2, 2, 2, 3];
  const idx = exponentialSearch(a, 2);
  assert.ok(idx >= 1 && idx <= 3, `应在 [1,3] 内，实际 ${idx}`);
});

test('exponentialSearch 与 indexOf 结果一致（大数组）', () => {
  const big: number[] = [];
  for (let i = 0; i < 1000; i++) big.push(i * 3 + 1); // 1,4,7,...
  for (let t = -5; t <= big[big.length - 1]! + 5; t++) {
    const expected = big.indexOf(t);
    assert.equal(exponentialSearch(big, t), expected, `target=${t}`);
  }
});

test('exponentialSearch 钩子被调用', () => {
  let bound = 0;
  let probe = 0;
  let done = -999;
  exponentialSearch(A, 18, {
    onBound: () => bound++,
    onProbe: () => probe++,
    onDone: (i) => (done = i),
  });
  assert.ok(bound > 0, '应至少一次倍增探测');
  assert.ok(probe > 0, '应至少一次二分探测');
  assert.equal(done, 8);
});

test('exponentialSearch 首元素不漏', () => {
  // bound 从 1 起，必须靠特判保证 a[0] 可命中
  assert.equal(exponentialSearch([10, 20, 30, 40], 10), 0);
});
