import { test } from 'node:test';
import assert from 'node:assert/strict';
import { palindromepartitionbt } from '../../src/algorithms/backtracking/palindrome-partition-bt/impl.ts';

test('palindrome-partition-bt 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof palindromepartitionbt === 'function');
});
