import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashString, subHash, buildPowB } from '../../src/algorithms/string/hash-string/impl.ts';

test('hashString 前缀哈希构造', () => {
  const prefix = hashString('abc');
  assert.equal(prefix.length, 4);
  assert.equal(prefix[0], 0);
  // 前缀哈希严格递增（BASE、字符码均正）
  assert.ok(prefix[1]! > 0);
});

test('hashString 子串哈希相等性', () => {
  const s = 'abcabcabc';
  const prefix = hashString(s);
  const powB = buildPowB(s.length + 1);
  // 相同内容子串哈希相等
  const h1 = subHash(prefix, powB, 0, 2); // 'abc' @0
  const h2 = subHash(prefix, powB, 3, 5); // 'abc' @3
  const h3 = subHash(prefix, powB, 6, 8); // 'abc' @6
  assert.equal(h1, h2);
  assert.equal(h2, h3);
  // 不同子串
  const h4 = subHash(prefix, powB, 0, 5); // 'abcabc'
  assert.notEqual(h1, h4);
});

test('hashString 单字符与空串', () => {
  assert.deepEqual(hashString(''), [0]);
  const p = hashString('A');
  assert.equal(p.length, 2);
  assert.equal(p[0], 0);
  assert.equal(p[1], 65); // 'A'.charCodeAt(0)
});

test('hashString 钩子被调用', () => {
  let prefixCalls = 0;
  let doneVal: number[] | null = null;
  const prefix = hashString('abcd', {
    onPrefix: () => prefixCalls++,
    onDone: (p) => {
      doneVal = p;
    },
  });
  assert.equal(prefixCalls, 4);
  assert.deepEqual(doneVal, prefix);
});
