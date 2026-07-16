import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dfs, buildAdjacency, type GraphInput } from '../../src/algorithms/graph/dfs/impl.ts';

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

test('dfs 先序访问（一条路走到底）', () => {
  // 1→2→5→6→3（6 的邻居 3,5,7 排序，3 未访问）→回溯...→4→7
  // 详细：discover 1,2,5,6；6 邻居 [3,5,7]：3 未访问→discover 3；3 邻居 [1,6] 都访问过→leave；
  // 回 6：5 访问过、7 未访问→discover 7；7 邻居[4,6]：4 未访问→discover 4；4 邻居[1,7]访问→leave...
  const order = dfs(G, '1');
  assert.equal(order[0], '1');
  assert.equal(order[1], '2');
  assert.equal(order[2], '5');
  assert.equal(order[3], '6');
  assert.equal(order[4], '3');
  assert.equal(order.length, 7);
  assert.deepEqual(new Set(order), new Set(['1', '2', '3', '4', '5', '6', '7']));
});

test('dfs 单节点 / 不连通', () => {
  assert.deepEqual(dfs({ nodes: ['A'], edges: [] }, 'A'), ['A']);
  const g2: GraphInput = { nodes: ['1', '2', '8'], edges: [{ from: '1', to: '2' }] };
  assert.deepEqual(new Set(dfs(g2, '1')), new Set(['1', '2']));
});

test('dfs 有向图', () => {
  const dg: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'C', to: 'D' },
    ],
    directed: true,
  };
  // A→B(死路)→C→D
  assert.deepEqual(dfs(dg, 'A'), ['A', 'B', 'C', 'D']);
});

test('dfs 不存在起点返回空', () => {
  assert.deepEqual(dfs(G, 'X'), []);
});

test('dfs buildAdjacency 邻居排序', () => {
  const adj = buildAdjacency(G);
  assert.deepEqual(adj.get('1'), ['2', '3', '4']);
  assert.deepEqual(adj.get('6'), ['3', '5', '7']);
});

test('dfs 钩子：onLeave 次数 == onDiscover 次数', () => {
  let enter = 0;
  let leave = 0;
  dfs(G, '1', {
    onDiscover: () => enter++,
    onLeave: () => leave++,
  });
  assert.equal(enter, 7);
  assert.equal(leave, 7);
});

test('dfs 钩子：起点 onDiscover parent 为 null', () => {
  const first: Array<[string, string | null]> = [];
  dfs(G, '1', { onDiscover: (n, p) => first.push([n, p]) });
  assert.deepEqual(first[0], ['1', null]);
});
