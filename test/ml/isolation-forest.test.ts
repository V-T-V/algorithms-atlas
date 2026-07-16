import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isolationforest } from '../../src/algorithms/ml/isolation-forest/impl.ts';

test('isolation-forest 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof isolationforest === 'function');
});
