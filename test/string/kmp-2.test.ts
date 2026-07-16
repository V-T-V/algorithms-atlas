import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kmp2, buildNext } from '../../src/algorithms/string/kmp-2/impl.ts';

test('kmp2 基本匹配', () => {
  assert.deepEqual(kmp2('', ''), []);
  assert.deepEqual(kmp2('ABC', 'ABCDE'), []);
  assert.deepEqual(kmp2('A', 'A'), [0]);
  assert.deepEqual(kmp2('ABCDEF', 'CD'), [2]);
  assert.deepEqual(kmp2('AAAAA', 'AA'), [0, 1, 2, 3]);
  assert.deepEqual(kmp2('ABABDABACDABABCABAB', 'ABABCABAB'), [10]);
  assert.deepEqual(kmp2('HELLO WORLD', 'XYZ'), []);
});

test('buildNext next 数组（首位 -1，长度 m+1）', () => {
  assert.deepEqual(buildNext('ABABCABAB'), [-1, 0, 0, 1, 2, 0, 1, 2, 3, 4]);
  assert.deepEqual(buildNext('AAAA'), [-1, 0, 1, 2, 3]);
  assert.deepEqual(buildNext('A'), [-1, 0]);
});

test('kmp2 钩子被调用', () => {
  let compares = 0;
  let founds = 0;
  kmp2('ABABDABACDABABCABAB', 'ABABCABAB', {
    onCompare: () => compares++,
    onFound: () => founds++,
  });
  assert.ok(compares > 0);
  assert.equal(founds, 1);
});
