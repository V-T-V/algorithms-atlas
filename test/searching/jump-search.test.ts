import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jumpSearch } from '../../src/algorithms/searching/jump-search/impl.ts';

const A = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

test('jumpSearch 命中与未命中', () => {
  assert.equal(jumpSearch(A, 15), 7);
  assert.equal(jumpSearch(A, 1), 0); // 首元素
  assert.equal(jumpSearch(A, 21), 10); // 末元素
  assert.equal(jumpSearch(A, 9), 4); // 块边界附近
  assert.equal(jumpSearch(A, 8), -1); // 不存在（在范围内）
  assert.equal(jumpSearch(A, 0), -1); // 比所有都小
  assert.equal(jumpSearch(A, 99), -1); // 比所有都大
});

test('jumpSearch 边界', () => {
  assert.equal(jumpSearch([], 1), -1); // 空数组
  assert.equal(jumpSearch([5], 5), 0); // 单元素命中
  assert.equal(jumpSearch([5], 3), -1); // 单元素未命中
  assert.equal(jumpSearch([1, 2], 1), 0);
  assert.equal(jumpSearch([1, 2], 2), 1);
});

test('jumpSearch 重复元素', () => {
  const a = [1, 2, 2, 2, 3];
  const idx = jumpSearch(a, 2);
  assert.ok(idx >= 1 && idx <= 3, `应在 [1,3] 内，实际 ${idx}`);
});

test('jumpSearch 与 binarySearch 结果一致', () => {
  const big: number[] = [];
  for (let i = 0; i < 1000; i++) big.push(i * 2 + 1); // 奇数 1..1999
  for (let t = -5; t <= 2005; t++) {
    const expected = big.indexOf(t);
    assert.equal(jumpSearch(big, t), expected, `target=${t}`);
  }
});

test('jumpSearch 钩子被调用', () => {
  let jumps = 0;
  let linear = 0;
  let done = -999;
  jumpSearch(A, 15, {
    onJump: () => jumps++,
    onLinearCompare: () => linear++,
    onDone: (i) => (done = i),
  });
  assert.ok(jumps > 0, '应至少跳跃一次');
  assert.ok(linear > 0, '应至少线性比较一次');
  assert.equal(done, 7);
});
