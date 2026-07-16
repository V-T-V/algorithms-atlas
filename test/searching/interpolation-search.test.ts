import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interpolationSearch } from '../../src/algorithms/searching/interpolation-search/impl.ts';

const A = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

test('interpolationSearch 命中与未命中', () => {
  assert.equal(interpolationSearch(A, 70), 6);
  assert.equal(interpolationSearch(A, 10), 0); // 首元素
  assert.equal(interpolationSearch(A, 100), 9); // 末元素
  assert.equal(interpolationSearch(A, 50), 4); // 正中
  assert.equal(interpolationSearch(A, 55), -1); // 不存在（在范围内）
  assert.equal(interpolationSearch(A, 5), -1); // 比所有都小
  assert.equal(interpolationSearch(A, 999), -1); // 比所有都大
});

test('interpolationSearch 边界', () => {
  assert.equal(interpolationSearch([], 1), -1); // 空数组
  assert.equal(interpolationSearch([5], 5), 0); // 单元素命中
  assert.equal(interpolationSearch([5], 3), -1); // 单元素未命中
  assert.equal(interpolationSearch([5], 5), 0);
  assert.equal(interpolationSearch([1, 2], 1), 0);
  assert.equal(interpolationSearch([1, 2], 2), 1);
});

test('interpolationSearch 全相同元素（避免除零）', () => {
  const a = [7, 7, 7, 7, 7];
  assert.equal(interpolationSearch(a, 7), 0); // 命中（任一）
  assert.equal(interpolationSearch(a, 3), -1); // 不在范围
  assert.equal(interpolationSearch(a, 9), -1);
});

test('interpolationSearch 与 indexOf 结果一致', () => {
  const big: number[] = [];
  for (let i = 0; i < 500; i++) big.push(i * 3 + 2); // 2,5,8,... 均匀
  for (let t = -5; t <= big[big.length - 1]! + 5; t++) {
    const expected = big.indexOf(t);
    assert.equal(interpolationSearch(big, t), expected, `target=${t}`);
  }
});

test('interpolationSearch 钩子被调用', () => {
  let probe = 0;
  let done = -999;
  interpolationSearch(A, 70, {
    onProbe: () => probe++,
    onDone: (i) => (done = i),
  });
  assert.ok(probe > 0, '应至少探测一次');
  assert.equal(done, 6);
});
