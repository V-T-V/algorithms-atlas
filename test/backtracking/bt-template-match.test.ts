import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wordPatternMatch } from '../../src/algorithms/backtracking/bt-template-match/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-template-match/trace.ts';
test('wordPatternMatch 正确', () => {
  assert.equal(wordPatternMatch('abab', 'redblueredblue'), true);
  assert.equal(wordPatternMatch('aaaa', 'asdasdasdasd'), true);
  assert.equal(wordPatternMatch('aabb', 'xyzabcxzyabc'), false);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
