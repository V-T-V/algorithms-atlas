import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscValidPalindromePhr } from '../../src/algorithms/misc/misc-valid-palindrome-phr/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-valid-palindrome-phr/trace.ts';
test('回文 "A man, a plan, a canal: Panama"=true', () => {
  assert.equal(miscValidPalindromePhr('A man, a plan, a canal: Panama'), true);
});
test('非回文 "race a car"=false', () => {
  assert.equal(miscValidPalindromePhr('race a car'), false);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
