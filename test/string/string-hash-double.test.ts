import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DoubleHasher, doubleHash } from '../../src/algorithms/string/string-hash-double/impl.ts';

test('DoubleHasher 相同子串哈希相等', () => {
  const s = 'abcabcabc';
  const h = new DoubleHasher(s);
  // [0,3) 与 [3,6) 与 [6,9) 都是 "abc"
  const a = h.hash(0, 3);
  const b = h.hash(3, 6);
  const c = h.hash(6, 9);
  assert.deepEqual(a, b);
  assert.deepEqual(b, c);
});

test('DoubleHasher 不同子串哈希不同', () => {
  const s = 'abcdef';
  const h = new DoubleHasher(s);
  assert.notDeepEqual(h.hash(0, 2), h.hash(1, 3));
});

test('DoubleHasher 整串等于 [0,n)', () => {
  const s = 'hello';
  const h = new DoubleHasher(s);
  assert.deepEqual(h.fullHash(), h.hash(0, s.length));
});

test('doubleHash 函数式', () => {
  const s = 'test';
  assert.deepEqual(doubleHash(s), new DoubleHasher(s).fullHash());
});

test('DoubleHasher 单字符', () => {
  const h = new DoubleHasher('a');
  assert.deepEqual(h.hash(0, 1), { h1: 97 % 1000000007, h2: 97 % 1000000009 });
});

test('DoubleHasher 越界抛错', () => {
  const h = new DoubleHasher('abc');
  assert.throws(() => h.hash(-1, 2), RangeError);
  assert.throws(() => h.hash(0, 4), RangeError);
});
