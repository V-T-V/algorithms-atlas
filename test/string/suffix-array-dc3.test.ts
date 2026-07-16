import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  suffixArrayDc3,
  suffixArrayDc3String,
} from '../../src/algorithms/string/suffix-array-dc3/impl.ts';

const naive = (s: string): number[] => {
  const sa = Array.from({ length: s.length }, (_, i) => i);
  return sa.sort((a, b) => {
    const sa2 = s.slice(a);
    const sb = s.slice(b);
    return sa2 < sb ? -1 : sa2 > sb ? 1 : 0;
  });
};

test('suffixArrayDc3String banana 经典', () => {
  const { sa } = suffixArrayDc3String('banana');
  assert.deepEqual(sa, [5, 3, 1, 0, 4, 2]);
});

test('suffixArrayDc3String 与朴素一致', () => {
  for (const s of ['abracadabra', 'mississippi', 'aaaa', 'abcabc', 'cabbage', 'xyz', 'aabaab']) {
    const { sa } = suffixArrayDc3String(s);
    assert.deepEqual(sa, naive(s), `${s}: ${sa.join(',')} vs ${naive(s).join(',')}`);
  }
});

test('suffixArrayDc3String 单字符与空', () => {
  assert.deepEqual(suffixArrayDc3String('').sa, []);
  assert.deepEqual(suffixArrayDc3String('a').sa, [0]);
});

test('suffixArrayDc3String rank 互逆', () => {
  const { sa, rank } = suffixArrayDc3String('abracadabra');
  for (let i = 0; i < sa.length; i++) assert.equal(rank[sa[i]!], i);
});

test('suffixArrayDc3 整数数组', () => {
  // [3,1,2] → 后缀 [3,1,2], [1,2], [2] → 起点 1,2,0
  assert.deepEqual(suffixArrayDc3([3, 1, 2]), [1, 2, 0]);
});
