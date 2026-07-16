import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sunday, buildSundayShift } from '../../src/algorithms/string/sunday/impl.ts';

test('sunday 基本匹配', () => {
  assert.deepEqual(sunday('AABAACAADAABAABA', 'AABA'), [0, 9, 12]);
  assert.deepEqual(sunday('ABCDEF', 'CD'), [2]);
  assert.deepEqual(sunday('HELLO', 'XYZ'), []);
  assert.deepEqual(sunday('AAAAA', 'AA'), [0, 1, 2, 3]);
});

test('buildSundayShift', () => {
  const t = buildSundayShift('ABAC'); // m=4
  // A 最右在 2 -> 4-2=2; B 在 1 -> 4-1=3; C 在 3 -> 4-3=1
  assert.equal(t['A'.charCodeAt(0)], 2);
  assert.equal(t['B'.charCodeAt(0)], 3);
  assert.equal(t['C'.charCodeAt(0)], 1);
  assert.equal(t['Z'.charCodeAt(0)], 5); // m+1
});

test('sunday 钩子被调用', () => {
  let aligns = 0;
  let founds = 0;
  sunday('AABAACAADAABAABA', 'AABA', {
    onAlign: () => aligns++,
    onFound: () => founds++,
  });
  assert.ok(aligns > 0);
  assert.equal(founds, 3);
});
