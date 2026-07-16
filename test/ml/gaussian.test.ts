import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gaussian } from '../../src/algorithms/ml/gaussian/impl.ts';

test('gaussian 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof gaussian === 'function');
});
