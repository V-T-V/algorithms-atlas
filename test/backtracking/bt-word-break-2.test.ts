import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wordBreak } from '../../src/algorithms/backtracking/bt-word-break-2/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-word-break-2/trace.ts';
test('wordBreak 正确', () => {
  const r = wordBreak('catsanddog', ['cat', 'cats', 'and', 'sand', 'dog']);
  assert.equal(r.length, 2);
  assert.ok(r.includes('cats and dog'));
  assert.ok(r.includes('cat sand dog'));
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
