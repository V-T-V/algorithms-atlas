import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aho } from '../../src/algorithms/string/aho/impl.ts';

test('aho 基本匹配', () => {
  assert.deepEqual(aho('AABAACAADAABAABA', 'AABA'), [0, 9, 12]);
  assert.deepEqual(aho('ABCDEF', 'CD'), [2]);
  assert.deepEqual(aho('HELLO', 'XYZ'), []);
  assert.deepEqual(aho('AAAAA', 'AA'), [0, 1, 2, 3]);
});

test('aho 边界', () => {
  assert.deepEqual(aho('', 'A'), []);
  assert.deepEqual(aho('A', 'A'), [0]);
  assert.deepEqual(aho('ABC', ''), []);
});

test('aho 与朴素一致', () => {
  const text = 'mississippi';
  const pat = 'issi';
  const naive: number[] = [];
  for (let i = 0; i <= text.length - pat.length; i++) {
    if (text.slice(i, i + pat.length) === pat) naive.push(i);
  }
  assert.deepEqual(aho(text, pat), naive);
});

test('aho 钩子被调用', () => {
  let transfers = 0;
  let founds = 0;
  aho('AABAACAADAABAABA', 'AABA', {
    onTransfer: () => transfers++,
    onFound: () => founds++,
  });
  assert.ok(transfers > 0);
  assert.equal(founds, 3);
});
