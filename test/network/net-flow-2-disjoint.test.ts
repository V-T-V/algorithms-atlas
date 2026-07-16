import { test } from 'node:test';
import assert from 'node:assert/strict';
import { twoDisjointPaths } from '../../src/algorithms/network/net-flow-2-disjoint/impl.ts';

test('twoDisjointPaths 存在两条不相交路径', () => {
  const paths = twoDisjointPaths({
    n: 4,
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 3 },
    ],
    s: 0,
    t: 3,
  });
  assert.equal(paths.length, 2);
  // 两路径中间节点集合不相交
  const mid = paths.map((p) => p.slice(1, -1).sort().join(','));
  assert.notEqual(mid[0], mid[1]);
});

test('twoDisjointPaths 仅一条路径时返回空', () => {
  const paths = twoDisjointPaths({
    n: 3,
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
    ],
    s: 0,
    t: 2,
  });
  assert.equal(paths.length, 0);
});

test('twoDisjointPaths 每条路径首尾正确', () => {
  const paths = twoDisjointPaths({
    n: 4,
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 3 },
    ],
    s: 0,
    t: 3,
  });
  for (const p of paths) {
    assert.equal(p[0], 0);
    assert.equal(p[p.length - 1], 3);
  }
});

test('twoDisjointPaths 钩子被调用', () => {
  let augs = 0;
  twoDisjointPaths(
    {
      n: 4,
      edges: [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 3 },
      ],
      s: 0,
      t: 3,
    },
    { onAugment: () => augs++ },
  );
  assert.ok(augs >= 1);
});
