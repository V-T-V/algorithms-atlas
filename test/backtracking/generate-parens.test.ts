import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateparens } from '../../src/algorithms/backtracking/generate-parens/impl.ts';

test('generate-parens 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof generateparens === 'function');
});
