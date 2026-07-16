import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gradientboost } from '../../src/algorithms/ml/gradient-boost/impl.ts';

test('gradient-boost 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof gradientboost === 'function');
});
