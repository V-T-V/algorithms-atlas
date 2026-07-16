import { test } from 'node:test';
import assert from 'node:assert/strict';
import { twoWay } from '../../src/algorithms/string/two-way/impl.ts';

test('twoWay 基本匹配', () => {
  assert.deepEqual(twoWay('AABAACAADAABAABA', 'AABA'), [0, 9, 12]);
  assert.deepEqual(twoWay('ABCDEF', 'CD'), [2]);
  assert.deepEqual(twoWay('HELLO', 'XYZ'), []);
  // 重叠
  assert.deepEqual(twoWay('AAAAA', 'AA'), [0, 1, 2, 3]);
});

test('twoWay 边界', () => {
  assert.deepEqual(twoWay('', 'A'), []);
  assert.deepEqual(twoWay('ABC', ''), []);
  assert.deepEqual(twoWay('A', 'ABC'), []);
  assert.deepEqual(twoWay('A', 'A'), [0]);
});

test('twoWay 与朴素一致', () => {
  const text = 'abracadabra-abracadabra';
  const pat = 'abra';
  const naive: number[] = [];
  for (let i = 0; i <= text.length - pat.length; i++) {
    if (text.slice(i, i + pat.length) === pat) naive.push(i);
  }
  assert.deepEqual(twoWay(text, pat), naive);
});

test('twoWay 钩子被调用', () => {
  let aligns = 0;
  let founds = 0;
  twoWay('AABAACAADAABAABA', 'AABA', {
    onAlign: () => aligns++,
    onFound: () => founds++,
  });
  assert.ok(aligns > 0);
  assert.equal(founds, 3);
});
