import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stringSort, compareStrings } from '../../src/algorithms/string/string-sort/impl.ts';

test('compareStrings 字典序', () => {
  assert.equal(compareStrings('abc', 'abd'), -1);
  assert.equal(compareStrings('abc', 'abc'), 0);
  assert.equal(compareStrings('abd', 'abc'), 1);
  assert.equal(compareStrings('ab', 'abc'), -1); // 短串靠前
  assert.equal(compareStrings('abc', 'ab'), 1);
});

test('stringSort 基本排序', () => {
  assert.deepEqual(stringSort(['banana', 'apple', 'cherry']), ['apple', 'banana', 'cherry']);
  assert.deepEqual(stringSort(['c', 'b', 'a']), ['a', 'b', 'c']);
  assert.deepEqual(stringSort([]), []);
});

test('stringSort 稳定与去重无关', () => {
  // 不去重，仅排序
  const r = stringSort(['ab', 'aa', 'ab', 'aa']);
  assert.deepEqual(r, ['aa', 'aa', 'ab', 'ab']);
});

test('stringSort 前缀关系', () => {
  assert.deepEqual(stringSort(['abc', 'ab', 'abcd']), ['ab', 'abc', 'abcd']);
});

test('stringSort 钩子', () => {
  let compares = 0;
  stringSort(['c', 'a', 'b'], { onCompare: () => compares++ });
  assert.ok(compares > 0);
});
