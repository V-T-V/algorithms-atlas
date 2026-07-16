import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shiftAnd } from '../../src/algorithms/string/shift-and/impl.ts';

test('shiftAnd 基本匹配', () => {
  assert.deepEqual(shiftAnd('AABAACAADAABAABA', 'AABA'), [0, 9, 12]);
  assert.deepEqual(shiftAnd('ABCDEF', 'CD'), [2]);
  assert.deepEqual(shiftAnd('HELLO', 'XYZ'), []);
  assert.deepEqual(shiftAnd('AAAAA', 'AA'), [0, 1, 2, 3]);
});

test('shiftAnd 钩子被调用', () => {
  let chars = 0;
  let founds = 0;
  shiftAnd('AABAACAADAABAABA', 'AABA', {
    onChar: () => chars++,
    onFound: () => founds++,
  });
  assert.ok(chars > 0);
  assert.equal(founds, 3);
});
