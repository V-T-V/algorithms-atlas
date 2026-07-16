import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  zigzagLevelOrder,
  buildTree,
} from '../../src/algorithms/tree/tree-levelorder-zigzag/impl.ts';

test('zigzagLevelOrder 完全树', () => {
  const root = buildTree([1, 2, 3, 4, 5, 6, 7]);
  // L0: [1], L1 rtl: [3,2], L2 ltr: [4,5,6,7]
  assert.deepEqual(zigzagLevelOrder(root), [1, 3, 2, 4, 5, 6, 7]);
});

test('zigzagLevelOrder 4 层', () => {
  const root = buildTree([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  assert.deepEqual(zigzagLevelOrder(root), [1, 3, 2, 4, 5, 6, 7, 15, 14, 13, 12, 11, 10, 9, 8]);
});

test('zigzagLevelOrder 边界', () => {
  assert.deepEqual(zigzagLevelOrder(null), []);
  assert.deepEqual(zigzagLevelOrder(buildTree([1])), [1]);
  assert.deepEqual(zigzagLevelOrder(buildTree([1, 2, null])), [1, 2]);
});

test('zigzagLevelOrder 方向交替', () => {
  const dirs: string[] = [];
  zigzagLevelOrder(buildTree([1, 2, 3, 4, 5, 6, 7]), {
    onLevel: (_l, dir) => dirs.push(dir),
  });
  assert.deepEqual(dirs, ['ltr', 'rtl', 'ltr']);
});
