import { test } from 'node:test';
import assert from 'node:assert/strict';
import { graphcoloring } from '../../src/algorithms/backtracking/graph-coloring/impl.ts';

test('graph-coloring 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof graphcoloring === 'function');
});
