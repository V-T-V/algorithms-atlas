import { test } from 'node:test';
import assert from 'node:assert/strict';
import { radixStringSort } from '../../src/algorithms/string/radix-string-sort/impl.ts';

test('radixStringSort 基本排序', () => {
  assert.deepEqual(radixStringSort(['banana', 'apple', 'cherry']), ['apple', 'banana', 'cherry']);
  assert.deepEqual(radixStringSort(['c', 'b', 'a']), ['a', 'b', 'c']);
  assert.deepEqual(radixStringSort([]), []);
});

test('radixStringSort 稳定去重无关', () => {
  const r = radixStringSort(['ab', 'aa', 'ab', 'aa']);
  assert.deepEqual(r, ['aa', 'aa', 'ab', 'ab']);
});

test('radixStringSort 前缀（短串靠前）', () => {
  assert.deepEqual(radixStringSort(['abc', 'ab', 'abcd']), ['ab', 'abc', 'abcd']);
  assert.deepEqual(radixStringSort(['a', 'aa', 'aaa']), ['a', 'aa', 'aaa']);
});

test('radixStringSort 与 stringSort 一致', () => {
  const words = ['she', 'shells', 'sea', 'shore', 'by', 'the', 'sea', 'shore'];
  const r1 = radixStringSort(words);
  const r2 = [...words].sort();
  assert.deepEqual(r1, r2);
});

test('radixStringSort 钩子', () => {
  let digits = 0;
  radixStringSort(['c', 'a', 'b'], { onDigit: () => digits++ });
  assert.ok(digits > 0);
});
