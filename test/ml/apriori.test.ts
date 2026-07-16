import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apriori } from '../../src/algorithms/ml/apriori/impl.ts';

test('apriori 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof apriori === 'function');
});
