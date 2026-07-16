import { test } from 'node:test';
import assert from 'node:assert/strict';
import { longestValidParentheses } from '../../src/algorithms/dp/dp-longest-valid-parentheses/impl.ts';

test('lvp (()()) = 6', () => {
  assert.equal(longestValidParentheses('(()())').maxLen, 6);
});

test('lvp )()()) = 4', () => {
  assert.equal(longestValidParentheses(')()())').maxLen, 4);
});

test('lvp 空串 = 0', () => {
  assert.equal(longestValidParentheses('').maxLen, 0);
});

test('lvp (((( = 0', () => {
  assert.equal(longestValidParentheses('((((').maxLen, 0);
});

test('lvp ()( = 2', () => {
  assert.equal(longestValidParentheses('()(').maxLen, 2);
});

test('lvp 隔离的 ()()() = 6', () => {
  assert.equal(longestValidParentheses('()()()').maxLen, 6);
});

test('lvp 钩子被调用', () => {
  let calls = 0;
  longestValidParentheses('(())', { onChar: () => calls++ });
  assert.ok(calls > 0);
});
