import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kmp4, prefixFunction } from '../../src/algorithms/string/str-kmp-4/impl.ts';

test('prefix function', () => {
  assert.deepEqual(prefixFunction('ABABCABAB'), [0, 0, 1, 2, 0, 1, 2, 3, 4]);
});

test('kmp4 match', () => {
  assert.deepEqual(kmp4('ABABDABACDABABCABAB', 'ABABCABAB'), [10]);
  assert.deepEqual(kmp4('AAAAA', 'AA'), [0, 1, 2, 3]);
});

test('kmp4 no match', () => {
  assert.deepEqual(kmp4('ABCDEF', 'XYZ'), []);
});
