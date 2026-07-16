import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dbscan } from '../../src/algorithms/ml/dbscan/impl.ts';

test('dbscan 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof dbscan === 'function');
});
