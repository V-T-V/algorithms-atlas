import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reachableNodes } from '../../src/algorithms/graph/graph-reachable-2/impl.ts';

const G = {
  nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
  ],
  directed: true,
};

test('reachable A 可达 4 个', () => {
  const r = reachableNodes(G, 'A');
  assert.equal(r.length, 5); // A,B,C,D,E
  assert.ok(r.includes('A'));
  assert.ok(!r.includes('F'));
});

test('reachable F 孤立', () => {
  const r = reachableNodes(G, 'F');
  assert.deepEqual(r, ['F']);
});

test('reachable 无向图', () => {
  const r = reachableNodes({ nodes: ['A', 'B', 'C'], edges: [{ from: 'A', to: 'B' }] }, 'A');
  assert.deepEqual(r.sort(), ['A', 'B']);
});

test('reachable 不存在的源', () => {
  const r = reachableNodes(G, 'Z');
  assert.deepEqual(r, []);
});
