import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hierarchical } from '../../src/algorithms/ml/hierarchical/impl.ts';

test('hierarchical 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof hierarchical === 'function');
});
