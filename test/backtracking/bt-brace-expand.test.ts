import { test } from 'node:test';
import assert from 'node:assert/strict';
import { expand } from '../../src/algorithms/backtracking/bt-brace-expand/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-brace-expand/trace.ts';
test('expand 正确', () => {
  assert.deepEqual(expand('{a,b}c{d,e}'), ['acd', 'ace', 'bcd', 'bce']);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
