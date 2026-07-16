import { test } from 'node:test';
import assert from 'node:assert/strict';
import { naivebayes } from '../../src/algorithms/ml/naive-bayes/impl.ts';

test('naive-bayes 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof naivebayes === 'function');
});
