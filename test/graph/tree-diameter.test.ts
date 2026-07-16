import { test } from 'node:test';
import assert from 'node:assert/strict';
import { treeDiameter, type GraphInput } from '../../src/algorithms/graph/tree-diameter/impl.ts';

const G: GraphInput = {
  nodes: ['1', '2', '3', '4', '5', '6'],
  edges: [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '2', to: '6' },
  ],
};

test('tree-diameter 链式直径', () => {
  const { length, path, endpoints } = treeDiameter(G);
  assert.equal(length, 4);
  assert.equal(path.length, 5);
  const ep = [...endpoints].sort();
  assert.deepEqual(ep, ['1', '5']);
  assert.ok((path[0] === '1' && path[4] === '5') || (path[0] === '5' && path[4] === '1'));
});

test('tree-diameter 单点', () => {
  const r = treeDiameter({ nodes: ['X'], edges: [] });
  assert.equal(r.length, 0);
  assert.deepEqual(r.path, ['X']);
});

test('tree-diameter 加权', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: 3 },
      { from: 'B', to: 'C', weight: 5 },
    ],
  };
  const { length, endpoints } = treeDiameter(g);
  assert.equal(length, 8);
  const ep = [...endpoints].sort();
  assert.deepEqual(ep, ['A', 'C']);
});

test('tree-diameter 星形', () => {
  const g: GraphInput = {
    nodes: ['C', 'a', 'b', 'c'],
    edges: [
      { from: 'C', to: 'a' },
      { from: 'C', to: 'b' },
      { from: 'C', to: 'c' },
    ],
  };
  assert.equal(treeDiameter(g).length, 2);
});

test('tree-diameter 钩子被调用', () => {
  const visits: string[] = [];
  let farCount = 0;
  let diamCalled = false;
  treeDiameter(G, {
    onVisit: (u) => visits.push(u),
    onFarthest: () => {
      farCount++;
    },
    onDiameter: () => {
      diamCalled = true;
    },
  });
  assert.equal(visits.length, 12);
  assert.equal(farCount, 2);
  assert.ok(diamCalled);
});
