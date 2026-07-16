import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kDisjointPaths } from '../../src/algorithms/network/net-flow-k-disjoint/impl.ts';

test('kDisjointPaths 找到全部边不相交路径', () => {
  const paths = kDisjointPaths({
    n: 4,
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 3 },
    ],
    s: 0,
    t: 3,
    k: 5,
  });
  assert.equal(paths.length, 2);
});

test('kDisjointPaths 受 k 限制', () => {
  const paths = kDisjointPaths({
    n: 4,
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 3 },
    ],
    s: 0,
    t: 3,
    k: 1,
  });
  assert.equal(paths.length, 1);
});

test('kDisjointPaths 无路径返回空', () => {
  const paths = kDisjointPaths({ n: 2, edges: [], s: 0, t: 1 });
  assert.equal(paths.length, 0);
});

test('kDisjointPaths 路径首尾正确', () => {
  const paths = kDisjointPaths({
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
