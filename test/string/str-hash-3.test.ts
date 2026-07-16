import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StringHash3 } from '../../src/algorithms/string/str-hash-3/impl.ts';

test('str-hash 相同子串哈希相等', () => {
  const h = new StringHash3('abcabcabc');
  assert.equal(h.hash(0, 2), h.hash(3, 5));
  assert.equal(h.hash(3, 5), h.hash(6, 8));
});

test('str-hash 不同子串哈希不等', () => {
  const h = new StringHash3('abcdef');
  assert.notEqual(h.hash(0, 2), h.hash(3, 5));
});

test('str-hash equals 跨实例', () => {
  const a = new StringHash3('abcd');
  const b = new StringHash3('xyabcd');
  assert.equal(a.equals(b, 0, 3, 2, 5), true);
});
