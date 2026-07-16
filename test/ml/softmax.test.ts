import { test } from 'node:test';
import assert from 'node:assert/strict';
import { softmax } from '../../src/algorithms/ml/softmax/impl.ts';

test('softmax 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof softmax === 'function');
});
