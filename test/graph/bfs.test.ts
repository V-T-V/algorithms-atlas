import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bfs, buildAdjacency, type GraphInput } from '../../src/algorithms/graph/bfs/impl.ts';

const G: GraphInput = {
  nodes: ['1', '2', '3', '4', '5', '6', '7'],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '1', to: '4' },
    { from: '2', to: '5' },
    { from: '3', to: '6' },
    { from: '4', to: '7' },
    { from: '5', to: '6' },
    { from: '6', to: '7' },
  ],
};

test('bfs 按层顺序访问', () => {
  // 1 → (2,3,4) → (5,6,7) ；邻居排序后顺序确定
  assert.deepEqual(bfs(G, '1'), ['1', '2', '3', '4', '5', '6', '7']);
});

test('bfs 单节点 / 不连通', () => {
  assert.deepEqual(bfs({ nodes: ['A'], edges: [] }, 'A'), ['A']);
  // 孤立点 8 不可达
  const g2: GraphInput = { nodes: ['1', '2', '8'], edges: [{ from: '1', to: '2' }] };
  assert.deepEqual(bfs(g2, '1'), ['1', '2']);
});

test('bfs 起点 / 邻居排序确定', () => {
  // 从 2 出发：2 → 1 → 5 → (1 的邻居 3,4) → (5 的邻居 6) → ...
  const order = bfs(G, '2');
  assert.equal(order[0], '2');
  assert.ok(order.indexOf('1') < order.indexOf('3'), '1 应先于 3 被访问');
});

test('bfs buildAdjacency 无向对称、邻居排序', () => {
  const adj = buildAdjacency(G);
  assert.deepEqual(adj.get('1'), ['2', '3', '4']);
  assert.deepEqual(adj.get('6'), ['3', '5', '7']); // 6 的邻居排序
  // 无向：含反向
  assert.ok(adj.get('7')?.includes('4'));
});

test('bfs 有向图', () => {
  const dg: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
    directed: true,
  };
  assert.deepEqual(bfs(dg, 'A'), ['A', 'B', 'C']);
  // C 无法回到 A
  assert.deepEqual(bfs(dg, 'C'), ['C']);
});

test('bfs 不存在起点返回空', () => {
  assert.deepEqual(bfs(G, 'X'), []);
});

test('bfs 钩子被调用', () => {
  const visits: string[] = [];
  const discovers: Array<[string, string | null]> = [];
  bfs(G, '1', {
    onVisit: (n) => visits.push(n),
    onDiscover: (n, p) => discovers.push([n, p]),
  });
  assert.equal(visits.length, 7);
  assert.deepEqual(discovers[0], ['1', null]); // 起点无父
  assert.equal(discovers.length, 7);
});
