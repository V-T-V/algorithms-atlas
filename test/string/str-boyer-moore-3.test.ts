import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boyerMoore } from '../../src/algorithms/string/str-boyer-moore-3/impl.ts';

test('boyer-moore 基础', () => {
  assert.deepEqual(boyerMoore('HERE IS A SIMPLE EXAMPLE', 'EXAMPLE'), [17]);
});

test('boyer-moore 重叠', () => {
  assert.deepEqual(boyerMoore('AAAAA', 'AA'), [0, 1, 2, 3]);
});

test('boyer-moore 无匹配', () => {
  assert.deepEqual(boyerMoore('ABCDEF', 'XYZ'), []);
});
