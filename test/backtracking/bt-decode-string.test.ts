import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decodeString } from '../../src/algorithms/backtracking/bt-decode-string/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-decode-string/trace.ts';
test('decodeString 正确', () => {
  assert.equal(decodeString('3[a2[c]]'), 'accaccacc');
  assert.equal(decodeString('2[abc]3[cd]ef'), 'abcabccdcdcdef');
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
