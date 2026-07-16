import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  findCutVertices,
  type BridgeGraphInput,
} from '../../src/algorithms/graph/graph-cut-3/impl.ts';

test('cut-vertex 基本例', () => {
  const g: BridgeGraphInput = {
    nodes: ['1', '2', '3', '4', '5'],
    edges: [
      { from: '1', to: '2' },
      { from: '1', to: '3' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
      { from: '4', to: '5' },
    ],
  };
  const r = findCutVertices(g).sort();
  // 3 和 4 都是割点
  assert.deepEqual(r, ['3', '4']);
});

test('cut-vertex 完全图无割点', () => {
  const g: BridgeGraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  assert.equal(findCutVertices(g).length, 0);
});
