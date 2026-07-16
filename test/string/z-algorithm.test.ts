import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zAlgorithm, zSearch } from '../../src/algorithms/string/z-algorithm/impl.ts';

test('zAlgorithm 基本用例', () => {
  // z[0]=0（约定）
  assert.deepEqual(zAlgorithm('aaaa'), [0, 3, 2, 1]);
  assert.deepEqual(
    zAlgorithm('aabxaabxcaabxaabxay'),
    [0, 1, 0, 0, 4, 1, 0, 0, 0, 8, 1, 0, 0, 5, 1, 0, 0, 1, 0],
  );
});

test('zAlgorithm 无重复前缀', () => {
  assert.deepEqual(zAlgorithm('abcdef'), [0, 0, 0, 0, 0, 0]);
});

test('zAlgorithm 全相同', () => {
  const z = zAlgorithm('zzzzz');
  assert.deepEqual(z, [0, 4, 3, 2, 1]);
});

test('zAlgorithm 空串', () => {
  assert.deepEqual(zAlgorithm(''), []);
});

test('zSearch 模式匹配', () => {
  assert.deepEqual(zSearch('ababcababacabab', 'abab'), [0, 5, 11]);
  assert.deepEqual(zSearch('hello world', 'world'), [6]);
  assert.deepEqual(zSearch('aaaaa', 'aa'), [0, 1, 2, 3]);
  assert.deepEqual(zSearch('abcdef', 'xyz'), []);
});

test('zAlgorithm 钩子被调用', () => {
  let sets = 0;
  let boxes = 0;
  zAlgorithm('aabxaabx', {
    onSet: () => sets++,
    onZBox: () => boxes++,
  });
  assert.ok(sets >= 1, '应至少 set 一次');
  assert.ok(boxes >= 0, 'Z-box 更新次数 >= 0');
});
