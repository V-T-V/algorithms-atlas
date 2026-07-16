import { test } from 'node:test';
import assert from 'node:assert/strict';
import { partition } from '../../src/algorithms/backtracking/bt-palindrome-partition/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-palindrome-partition/trace.ts';
test('partition 正确', () => {
  assert.deepEqual(partition('aab'), [
    ['a', 'a', 'b'],
    ['aa', 'b'],
  ]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
