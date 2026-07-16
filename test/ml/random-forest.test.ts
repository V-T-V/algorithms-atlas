import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomforest } from '../../src/algorithms/ml/random-forest/impl.ts';

test('random-forest 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof randomforest === 'function');
});
