import { test } from 'node:test';
import assert from 'node:assert/strict';
import { neuralnet } from '../../src/algorithms/ml/neural-net/impl.ts';

test('neural-net 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof neuralnet === 'function');
});
