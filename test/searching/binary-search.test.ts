import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binarySearch } from '../../src/algorithms/searching/binary-search/impl.ts';

test('binarySearch 命中与未命中', () => {
  const a = [1, 3, 5, 7, 9, 11, 13, 15, 17];
  assert.equal(binarySearch(a, 7), 3);
  assert.equal(binarySearch(a, 1), 0); // 首元素
  assert.equal(binarySearch(a, 17), 8); // 末元素
  assert.equal(binarySearch(a, 9), 4); // 正中
  assert.equal(binarySearch(a, 6), -1); // 不存在（在范围内）
  assert.equal(binarySearch(a, 0), -1); // 比所有都小
  assert.equal(binarySearch(a, 99), -1); // 比所有都大
});

test('binarySearch 边界', () => {
  assert.equal(binarySearch([], 1), -1); // 空数组
  assert.equal(binarySearch([5], 5), 0); // 单元素命中
  assert.equal(binarySearch([5], 3), -1); // 单元素未命中
  assert.equal(binarySearch([1, 2], 1), 0);
  assert.equal(binarySearch([1, 2], 2), 1);
});

test('binarySearch 重复元素（返回其中任一下标）', () => {
  const a = [1, 2, 2, 2, 3];
  const idx = binarySearch(a, 2);
  assert.ok(idx >= 1 && idx <= 3, `应在 [1,3] 内，实际 ${idx}`);
});

test('binarySearch 钩子被调用', () => {
  let probes = 0;
  let done = -999;
  binarySearch([1, 3, 5, 7, 9], 7, {
    onProbe: () => probes++,
    onDone: (i) => (done = i),
  });
  assert.ok(probes > 0, '应发生至少一次探测');
  assert.equal(done, 3, '应命中下标 3');
});
