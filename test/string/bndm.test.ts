import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bndm } from '../../src/algorithms/string/bndm/impl.ts';

test('bndm 基本匹配', () => {
  assert.deepEqual(bndm('AABAACAADAABAABA', 'AABA'), [0, 9, 12]);
  assert.deepEqual(bndm('ABCDEF', 'CD'), [2]);
  assert.deepEqual(bndm('HELLO', 'XYZ'), []);
  assert.deepEqual(bndm('AAAAA', 'AA'), [0, 1, 2, 3]);
});

test('bndm 长模式（<=32）', () => {
  const text = 'a'.repeat(10) + 'abcdefghij' + 'a'.repeat(5);
  assert.deepEqual(bndm(text, 'abcdefghij'), [10]);
});

test('bndm 钩子被调用', () => {
  let scans = 0;
  let founds = 0;
  bndm('AABAACAADAABAABA', 'AABA', {
    onScan: () => scans++,
    onFound: () => founds++,
  });
  assert.ok(scans > 0);
  assert.equal(founds, 3);
});
