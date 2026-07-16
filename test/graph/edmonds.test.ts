import { test } from 'node:test';
import assert from 'node:assert/strict';
import { edmonds, type DirectedGraphInput } from '../../src/algorithms/graph/edmonds/impl.ts';

test('edmonds 含环：破环取最优 = 3', () => {
  const g: DirectedGraphInput = {
    nodes: ['R', 'A', 'B', 'C'],
    edges: [
      { from: 'R', to: 'A', weight: 1 },
      { from: 'R', to: 'B', weight: 5 },
      { from: 'R', to: 'C', weight: 6 },
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'C', to: 'A', weight: 1 },
    ],
    root: 'R',
  };
  const { exists, totalWeight, edges } = edmonds(g);
  assert.equal(exists, true);
  assert.equal(totalWeight, 3);
  assert.equal(edges.length, 3); // n-1 条
});

test('edmonds 无环 DAG 直接取最小入边', () => {
  const g: DirectedGraphInput = {
    nodes: ['R', 'A', 'B'],
    edges: [
      { from: 'R', to: 'A', weight: 2 },
      { from: 'R', to: 'B', weight: 5 },
      { from: 'A', to: 'B', weight: 1 },
    ],
    root: 'R',
  };
  const { totalWeight } = edmonds(g);
  assert.equal(totalWeight, 3); // R→A(2) + A→B(1)
});

test('edmonds 单点', () => {
  const g: DirectedGraphInput = { nodes: ['R'], edges: [], root: 'R' };
  const { exists, totalWeight, edges } = edmonds(g);
  assert.equal(exists, true);
  assert.equal(totalWeight, 0);
  assert.deepEqual(edges, []);
});

test('edmonds 不可达返回不存在', () => {
  const g: DirectedGraphInput = {
    nodes: ['R', 'A', 'B'],
    edges: [{ from: 'A', to: 'B', weight: 1 }],
    root: 'R',
  };
  const { exists, totalWeight } = edmonds(g);
  assert.equal(exists, false);
  assert.equal(totalWeight, Infinity);
});

test('edmonds 选中边数为 n-1', () => {
  const g: DirectedGraphInput = {
    nodes: ['R', 'A', 'B', 'C', 'D'],
    edges: [
      { from: 'R', to: 'A', weight: 1 },
      { from: 'A', to: 'B', weight: 2 },
      { from: 'B', to: 'C', weight: 3 },
      { from: 'C', to: 'D', weight: 1 },
      { from: 'D', to: 'A', weight: 1 },
      { from: 'R', to: 'D', weight: 4 },
    ],
    root: 'R',
  };
  const { edges } = edmonds(g);
  assert.equal(edges.length, g.nodes.length - 1);
});

test('edmonds 钩子被调用', () => {
  const minIns: string[] = [];
  let doneCalled = false;
  const g: DirectedGraphInput = {
    nodes: ['R', 'A', 'B'],
    edges: [
      { from: 'R', to: 'A', weight: 1 },
      { from: 'A', to: 'B', weight: 2 },
      { from: 'R', to: 'B', weight: 5 },
    ],
    root: 'R',
  };
  edmonds(g, {
    onSelectMinIn: (n) => minIns.push(n),
    onDone: () => {
      doneCalled = true;
    },
  });
  assert.equal(minIns.length, 2); // A 与 B 各选一次
  assert.ok(doneCalled);
});
