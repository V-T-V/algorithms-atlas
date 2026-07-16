import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SegmentTree2D, segment2d } from '../../src/algorithms/tree/segment-2d/impl.ts';

test('segment-2d：初始矩阵矩形求和', () => {
  const mat = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  const tree = new SegmentTree2D(3, 3, mat);
  assert.equal(tree.rectSum(1, 1, 3, 3), 45);
  assert.equal(tree.rectSum(1, 1, 1, 1), 1);
  assert.equal(tree.rectSum(2, 2, 3, 3), 5 + 6 + 8 + 9);
});

test('segment-2d：update 后查询受影响', () => {
  const tree = new SegmentTree2D(2, 2, [
    [1, 2],
    [3, 4],
  ]);
  tree.update(1, 1, 10);
  // 原矩阵和 1+2+3+4=10，(1,1) 加 10 后整体 = 20
  assert.equal(tree.rectSum(1, 1, 2, 2), 20);
  assert.equal(tree.rectSum(1, 1, 1, 1), 11);
});

test('segment-2d：便捷封装返回多查询', () => {
  const result = segment2d(
    [
      [1, 2],
      [3, 4],
    ],
    [
      { r1: 1, c1: 1, r2: 2, c2: 2 },
      { r1: 1, c1: 1, r2: 1, c2: 2 },
    ],
  );
  assert.deepEqual(result, [10, 3]);
});
