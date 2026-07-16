import { test } from 'node:test';
import assert from 'node:assert/strict';
import { manacher } from '../../src/algorithms/string/str-manacher-3/impl.ts';

test('manacher 简单', () => {
  const r = manacher('aba');
  assert.equal(r.length, 3);
  assert.equal(r.palindrome, 'aba');
});

test('manacher 偶回文', () => {
  const r = manacher('abba');
  assert.equal(r.length, 4);
  assert.equal(r.palindrome, 'abba');
});

test('manacher 混合', () => {
  const r = manacher('babad');
  assert.equal(r.length, 3);
  assert.ok(r.palindrome === 'aba' || r.palindrome === 'bab');
});
