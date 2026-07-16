import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splayTree } from '../../src/algorithms/tree/splay-tree/impl.ts';

test('splay-tree 基本行为', () => {
  assert.deepEqual(splayTree([]), []);
  assert.deepEqual(splayTree([1]), [1]);
  // TODO: 补充该算法的期望输出断言
});
