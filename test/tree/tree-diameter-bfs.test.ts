import { test } from 'node:test';
import assert from 'node:assert/strict';
import { treeDiameterBfs } from '../../src/algorithms/tree/tree-diameter-bfs/impl.ts';

test('treeDiameterBfs 链状树', () => {
  // 0-1-2-3-4-5，直径 5
  const adj = [[1], [0, 2], [1, 3], [2, 4], [3, 5], [4]];
  const { diameter, path } = treeDiameterBfs(adj);
  assert.equal(diameter, 5);
  assert.equal(path.length, 6);
});

test('treeDiameterBfs 星形树', () => {
  // 0 连 1,2,3,4，直径 2
  const adj = [[1, 2, 3, 4], [0], [0], [0], [0]];
  const { diameter } = treeDiameterBfs(adj);
  assert.equal(diameter, 2);
});

test('treeDiameterBfs 二叉树', () => {
  //       0
  //      / \
  //     1   2
  //    / \
  //   3   4
  //  /
  // 5
  // 直径：5-3-1-0-2 = 4
  const adj = [[1, 2], [0, 3, 4], [0], [1, 5], [1], [3]];
  const { diameter, path } = treeDiameterBfs(adj);
  assert.equal(diameter, 4);
  assert.equal(path[0], 5);
  assert.equal(path[path.length - 1], 2);
});

test('treeDiameterBfs 边界', () => {
  assert.deepEqual(treeDiameterBfs([]), { diameter: 0, path: [] });
  assert.deepEqual(treeDiameterBfs([[]]), { diameter: 0, path: [0] });
  const two = treeDiameterBfs([[1], [0]]);
  assert.equal(two.diameter, 1);
  assert.equal(two.path.length, 2);
});

test('treeDiameterBfs 两轮 BFS 均触发', () => {
  let v1 = 0;
  let v2 = 0;
  treeDiameterBfs([[1], [0, 2], [1]], {
    onVisit: (_n, _d, p) => {
      if (p === 1) v1++;
      else v2++;
    },
  });
  assert.ok(v1 >= 1);
  assert.ok(v2 >= 1);
});
