import { test } from 'node:test';
import assert from 'node:assert/strict';
import { linearSearch } from '../../src/algorithms/searching/linear-search/impl.ts';

test('linearSearch 命中与未命中', () => {
  const a = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  assert.equal(linearSearch(a, 8), 2);
  assert.equal(linearSearch(a, 5), 0); // 首元素
  assert.equal(linearSearch(a, 6), 8); // 末元素
  assert.equal(linearSearch(a, 10), -1); // 不存在
});

test('linearSearch 返回首个匹配', () => {
  const a = [1, 2, 2, 2, 3];
  assert.equal(linearSearch(a, 2), 1); // 重复取第一个
});

test('linearSearch 边界', () => {
  assert.equal(linearSearch([], 1), -1); // 空数组
  assert.equal(linearSearch([5], 5), 0); // 单元素命中
  assert.equal(linearSearch([5], 3), -1); // 单元素未命中
});

test('linearSearch 钩子被调用', () => {
  let probes = 0;
  let done = -999;
  linearSearch([5, 2, 8, 1], 8, {
    onProbe: () => probes++,
    onDone: (i) => (done = i),
  });
  assert.equal(probes, 3, '应在第 3 次探测命中');
  assert.equal(done, 2);
});
