import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shiftOr } from '../../src/algorithms/string/shift-or/impl.ts';

test('shiftOr 基本匹配', () => {
  assert.deepEqual(shiftOr('AABAACAADAABAABA', 'AABA'), [0, 9, 12]);
  assert.deepEqual(shiftOr('ABCDEF', 'CD'), [2]);
  assert.deepEqual(shiftOr('HELLO', 'XYZ'), []);
  assert.deepEqual(shiftOr('AAAAA', 'AA'), [0, 1, 2, 3]);
});

test('shiftOr 钩子被调用', () => {
  let chars = 0;
  let founds = 0;
  shiftOr('AABAACAADAABAABA', 'AABA', {
    onChar: () => chars++,
    onFound: () => founds++,
  });
  assert.ok(chars > 0);
  assert.equal(founds, 3);
});
