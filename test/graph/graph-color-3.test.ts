import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyColor, type BipGraphInput } from '../../src/algorithms/graph/graph-color-3/impl.ts';

test('color 三角形需 3 色', () => {
  const g: BipGraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  const r = greedyColor(g);
  assert.equal(r.maxColor, 3);
});

test('color 路径 2 色', () => {
  const g: BipGraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  assert.equal(greedyColor(g).maxColor, 2);
});
