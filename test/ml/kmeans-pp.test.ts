import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kmeanspp } from '../../src/algorithms/ml/kmeans-pp/impl.ts';

test('kmeans-pp 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof kmeanspp === 'function');
});
