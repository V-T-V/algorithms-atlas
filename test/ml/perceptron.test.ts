import { test } from 'node:test';
import assert from 'node:assert/strict';
import { perceptron } from '../../src/algorithms/ml/perceptron/impl.ts';

test('perceptron 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof perceptron === 'function');
});
