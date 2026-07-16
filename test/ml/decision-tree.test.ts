import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decisiontree } from '../../src/algorithms/ml/decision-tree/impl.ts';

test('decision-tree 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof decisiontree === 'function');
});
