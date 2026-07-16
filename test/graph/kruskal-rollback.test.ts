import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  kruskalRollback,
  RollbackDsu,
  type GraphInput,
} from '../../src/algorithms/graph/kruskal-rollback/impl.ts';

test('kruskal-rollback 基本 MST', () => {
  const g: GraphInput = {
    nodes: ['0', '1', '2', '3', '4'],
    edges: [
      { from: '0', to: '1', weight: 4 },
      { from: '0', to: '2', weight: 1 },
      { from: '1', to: '2', weight: 3 },
      { from: '1', to: '3', weight: 2 },
      { from: '2', to: '3', weight: 5 },
      { from: '3', to: '4', weight: 6 },
      { from: '2', to: '4', weight: 7 },
    ],
  };
  const { totalWeight, mstEdges } = kruskalRollback(g);
  // 0-2(1), 1-3(2), 1-2(3), 3-4(6) = 12
  assert.equal(totalWeight, 12);
  assert.equal(mstEdges.length, 4);
});

test('kruskal-rollback 单边 MST', () => {
  const g: GraphInput = {
    nodes: ['A', 'B'],
    edges: [{ from: 'A', to: 'B', weight: 5 }],
  };
  const { totalWeight, mstEdges } = kruskalRollback(g);
  assert.equal(totalWeight, 5);
  assert.equal(mstEdges.length, 1);
});

test('kruskal-rollback 不连通图 MST 边数 = V-分量数', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'C', to: 'D', weight: 2 },
    ],
  };
  const { mstEdges } = kruskalRollback(g);
  assert.equal(mstEdges.length, 2);
});

test('RollbackDsu 合并与撤销', () => {
  const dsu = new RollbackDsu(['A', 'B', 'C']);
  assert.equal(dsu.find('A') === 'A', true);
  assert.equal(dsu.find('B') === 'B', true);
  const cp = dsu.checkpoint();
  dsu.union('A', 'B');
  assert.equal(dsu.find('A') === dsu.find('B'), true);
  dsu.rollback(cp);
  assert.equal(dsu.find('A') === dsu.find('B'), false);
});

test('kruskal-rollback 钩子被调用', () => {
  const merges: string[] = [];
  kruskalRollback(
    {
      nodes: ['A', 'B'],
      edges: [{ from: 'A', to: 'B', weight: 1 }],
    },
    { onMerge: (u, v) => merges.push(`${u}-${v}`) },
  );
  assert.equal(merges.length, 1);
});
