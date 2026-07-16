import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dagShortestPath, type DagGraphInput } from '../../src/algorithms/graph/graph-sp-3/impl.ts';

const g: DagGraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 6 },
    { from: 'B', to: 'C', weight: 3 },
    { from: 'B', to: 'D', weight: 1 },
    { from: 'C', to: 'D', weight: 1 },
    { from: 'D', to: 'E', weight: 4 },
  ],
};

test('dag-sp 距离', () => {
  const r = dagShortestPath(g, 'A');
  assert.equal(r.dist.get('E'), 7);
  assert.equal(r.dist.get('C'), 5);
});
