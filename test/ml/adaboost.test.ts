import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adaboost } from '../../src/algorithms/ml/adaboost/impl.ts';

test('adaboost 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof adaboost === 'function');
});
