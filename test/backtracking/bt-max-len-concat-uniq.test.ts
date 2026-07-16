import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxLength } from '../../src/algorithms/backtracking/bt-max-len-concat-uniq/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-max-len-concat-uniq/trace.ts';
test('maxLength 正确', () => {
  assert.equal(maxLength(['un', 'iq', 'ue']), 4);
  assert.equal(maxLength(['cha', 'r', 'act', 'ers']), 6);
  assert.equal(maxLength(['abcdefghijklmnopqrstuvwxyz']), 26);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
