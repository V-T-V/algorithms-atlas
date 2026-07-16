import { test } from 'node:test';
import assert from 'node:assert/strict';
import { segmenttreelazy } from '../../src/algorithms/tree/segment-tree-lazy/impl.ts';

test('segment-tree-lazy 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof segmenttreelazy === 'function');
});
