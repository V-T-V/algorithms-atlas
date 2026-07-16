import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lcs3 } from '../../src/algorithms/dp/dp-lcs-3/impl.ts';

test('lcs3 三串公共', () => {
  assert.equal(lcs3('abcde', 'ace', 'abc'), 2);
});

test('lcs3 全等', () => {
  assert.equal(lcs3('abc', 'abc', 'abc'), 3);
});

test('lcs3 无公共', () => {
  assert.equal(lcs3('a', 'b', 'c'), 0);
});

test('lcs3 空串', () => {
  assert.equal(lcs3('', 'abc', 'ab'), 0);
});
