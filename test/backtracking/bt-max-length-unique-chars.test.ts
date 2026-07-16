import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btMaxLengthUniqueChars } from '../../src/algorithms/backtracking/bt-max-length-unique-chars/impl.ts';

test('bt-max-length-unique-chars ["un","iq","ue"]', () => {
  assert.equal(btMaxLengthUniqueChars(['un', 'iq', 'ue']), 4);
});

test('bt-max-length-unique-chars ["cha","r","act","ers"]', () => {
  assert.equal(btMaxLengthUniqueChars(['cha', 'r', 'act', 'ers']), 6);
});

test('bt-max-length-unique-chars ["abcdefghijklmnopqrstuvwxyz"]', () => {
  assert.equal(btMaxLengthUniqueChars(['abcdefghijklmnopqrstuvwxyz']), 26);
});

test('bt-max-length-unique-chars 自身重复被忽略', () => {
  assert.equal(btMaxLengthUniqueChars(['aa', 'bb']), 0);
});
