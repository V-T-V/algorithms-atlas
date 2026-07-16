import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zeroOneBfs, type GraphInput } from '../../src/algorithms/graph/zero-one-bfs/impl.ts';

const G: GraphInput = {
  nodes: ['s', 'a', 'b', 'c', 'd', 't'],
  edges: [
    { from: 's', to: 'a', weight: 1 },
    { from: 'a', to: 'b', weight: 0 },
    { from: 's', to: 'c', weight: 1 },
    { from: 'b', to: 't', weight: 1 },
    { from: 'c', to: 'd', weight: 0 },
    { from: 'd', to: 't', weight: 1 },
  ],
  source: 's',
  directed: true,
};

test('zero-one-bfs 距离正确', () => {
  const { dist } = zeroOneBfs(G);
  assert.equal(dist.get('s'), 0);
  assert.equal(dist.get('a'), 1);
  assert.equal(dist.get('b'), 1);
  assert.equal(dist.get('c'), 1);
  assert.equal(dist.get('d'), 1);
  assert.equal(dist.get('t'), 2);
});

test('zero-one-bfs 前驱可回溯路径', () => {
  const { prev } = zeroOneBfs(G);
  // t 距离为 2（含一条 0 权边 → 3 段路径），回溯得到 s→...→t
  const path: string[] = ['t'];
  let cur: string | null = 't';
  while (cur !== null && cur !== 's') {
    cur = prev.get(cur) ?? null;
    if (cur) path.push(cur);
  }
  path.reverse();
  assert.equal(path[0], 's');
  assert.equal(path[path.length - 1], 't');
  // 路径长度（边数）应 ≥ 加权距离（因含 0 权边）
  assert.ok(path.length - 1 >= 2);
});

test('zero-one-bfs 0 权边', () => {
  // 全 0 权：所有点距离 0
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: 0 },
      { from: 'B', to: 'C', weight: 0 },
    ],
    source: 'A',
    directed: true,
  };
  const { dist } = zeroOneBfs(g);
  assert.equal(dist.get('A'), 0);
  assert.equal(dist.get('B'), 0);
  assert.equal(dist.get('C'), 0);
});

test('zero-one-bfs 不可达为 ∞', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'X'],
    edges: [{ from: 'A', to: 'B', weight: 1 }],
    source: 'A',
    directed: true,
  };
  const { dist } = zeroOneBfs(g);
  assert.equal(dist.get('X'), Infinity);
});

test('zero-one-bfs 钩子被调用', () => {
  const pops: string[] = [];
  const relaxes: Array<{ to: string; improved: boolean }> = [];
  let doneCalled = false;
  zeroOneBfs(G, {
    onPop: (u) => pops.push(u),
    onRelax: (_f, to, _w, _nd, improved) => relaxes.push({ to, improved }),
    onDone: () => {
      doneCalled = true;
    },
  });
  assert.equal(pops.length, 6);
  assert.ok(relaxes.some((r) => r.improved));
  assert.ok(doneCalled);
});
