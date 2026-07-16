import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btWordPattern2 } from '../../src/algorithms/backtracking/bt-word-pattern-2/impl.ts';

test('bt-word-pattern-2 abab redblueredblue', () => {
  assert.equal(btWordPattern2('abab', 'redblueredblue'), true);
});

test('bt-word-pattern-2 aaaa 应全同子串', () => {
  assert.equal(btWordPattern2('aaaa', 'asdasdasdasd'), true);
  assert.equal(btWordPattern2('aaaa', 'asd'), false);
});

test('bt-word-pattern-2 ab dogcatdogcat', () => {
  assert.equal(btWordPattern2('ab', 'aa'), false); // 不同字母不能映射相同子串（双射）
});

test('bt-word-pattern-2 单字符', () => {
  assert.equal(btWordPattern2('a', 'x'), true);
  assert.equal(btWordPattern2('a', ''), false);
});
