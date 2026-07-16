import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateParenthesis } from '../../src/algorithms/backtracking/bt-generate-parens/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-generate-parens/trace.ts';
test('generateParenthesis 正确', () => {
  const r = generateParenthesis(3);
  assert.equal(r.length, 5);
  assert.ok(r.includes('((()))'));
  assert.ok(r.includes('()()()'));
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
