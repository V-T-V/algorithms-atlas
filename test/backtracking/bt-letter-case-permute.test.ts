import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btLetterCasePermute } from '../../src/algorithms/backtracking/bt-letter-case-permute/impl.ts';

test('bt-letter-case-permute a1b2', () => {
  const res = btLetterCasePermute('a1b2').sort();
  assert.deepEqual(res, ['A1B2', 'A1b2', 'a1B2', 'a1b2']);
});

test('bt-letter-case-permute 纯数字', () => {
  assert.deepEqual(btLetterCasePermute('123'), ['123']);
});

test('bt-letter-case-permute 单字母', () => {
  assert.deepEqual(btLetterCasePermute('a').sort(), ['A', 'a']);
});

test('bt-letter-case-permute 数量为 2^(字母数)', () => {
  assert.equal(btLetterCasePermute('ab').length, 4);
  assert.equal(btLetterCasePermute('abc').length, 8);
});
