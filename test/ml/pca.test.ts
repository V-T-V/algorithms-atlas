import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pca } from '../../src/algorithms/ml/pca/impl.ts';

test('pca 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof pca === 'function');
});
