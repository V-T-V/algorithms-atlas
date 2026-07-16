import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasPathSum, buildTree } from '../../src/algorithms/tree/tree-path-sum/impl.ts';

//        5
//       / \
//      4   8
//     /   / \
//    11  13  4
//   / \       \
//  7   2       1
const ROOT = () => buildTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]);

test('hasPathSum 命中', () => {
  assert.equal(hasPathSum(ROOT(), 22), true); // 5→4→11→2
  assert.equal(hasPathSum(ROOT(), 27), true); // 5→4→11→7
  assert.equal(hasPathSum(ROOT(), 26), true); // 5→8→13
  assert.equal(hasPathSum(ROOT(), 18), true); // 5→8→4→1
});

test('hasPathSum 未命中', () => {
  assert.equal(hasPathSum(ROOT(), 23), false);
  assert.equal(hasPathSum(ROOT(), 100), false);
  assert.equal(hasPathSum(ROOT(), 1), false);
});

test('hasPathSum 边界', () => {
  assert.equal(hasPathSum(null, 0), false);
  assert.equal(hasPathSum(buildTree([5]), 5), true);
  assert.equal(hasPathSum(buildTree([5]), 0), false);
});

test('hasPathSum 负数', () => {
  // -2 → -3 (路径和 -5)
  const root = buildTree([-2, null, -3]);
  assert.equal(hasPathSum(root, -5), true);
  assert.equal(hasPathSum(root, -2), false);
});

test('hasPathSum 钩子触发访问', () => {
  let visits = 0;
  let leafHit = false;
  hasPathSum(ROOT(), 22, {
    onVisit: () => visits++,
    onLeaf: (_v, hit) => {
      if (hit) leafHit = true;
    },
  });
  assert.ok(visits >= 4);
  assert.equal(leafHit, true);
});
