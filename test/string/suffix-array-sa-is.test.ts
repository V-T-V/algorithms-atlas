import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  suffixArraySaIs,
  suffixArraySaIsString,
} from '../../src/algorithms/string/suffix-array-sa-is/impl.ts';

const naive = (s: string): number[] => {
  const sa = Array.from({ length: s.length }, (_, i) => i);
  return sa.sort((a, b) => {
    const sa2 = s.slice(a);
    const sb = s.slice(b);
    return sa2 < sb ? -1 : sa2 > sb ? 1 : 0;
  });
};

test('suffixArraySaIsString banana 经典', () => {
  const { sa } = suffixArraySaIsString('banana');
  assert.deepEqual(sa, [5, 3, 1, 0, 4, 2]);
});

test('suffixArraySaIsString 与朴素一致', () => {
  for (const s of [
    'abracadabra',
    'mississippi',
    'aaaa',
    'abcabc',
    'cabbage',
    'xyz',
    'aabaab',
    'mmiissiissiippii',
  ]) {
    const { sa } = suffixArraySaIsString(s);
    assert.deepEqual(sa, naive(s), `${s}: ${sa.join(',')} vs ${naive(s).join(',')}`);
  }
});

test('suffixArraySaIsString 单字符与空', () => {
  assert.deepEqual(suffixArraySaIsString('').sa, []);
  assert.deepEqual(suffixArraySaIsString('a').sa, [0]);
});

test('suffixArraySaIsString rank 互逆', () => {
  const { sa, rank } = suffixArraySaIsString('abracadabra');
  for (let i = 0; i < sa.length; i++) assert.equal(rank[sa[i]!], i);
});

test('suffixArraySaIs 整数数组', () => {
  assert.deepEqual(suffixArraySaIs([3, 1, 2]), [1, 2, 0]);
});
