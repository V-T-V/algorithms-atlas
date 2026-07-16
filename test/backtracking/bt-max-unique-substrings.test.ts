import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxUniqueSplit } from '../../src/algorithms/backtracking/bt-max-unique-substrings/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-max-unique-substrings/trace.ts';
test('maxUniqueSplit 正确', () => {
  assert.equal(maxUniqueSplit('ababccc'), 4);
  assert.equal(maxUniqueSplit('aba'), 2);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
