import { test } from 'node:test';
import assert from 'node:assert/strict';
import { segmenttreepersist } from '../../src/algorithms/tree/segment-tree-persist/impl.ts';

test('segment-tree-persist 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof segmenttreepersist === 'function');
});
