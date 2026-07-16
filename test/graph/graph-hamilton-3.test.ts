import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hamiltonCycle,
  type BipGraphInput,
} from '../../src/algorithms/graph/graph-hamilton-3/impl.ts';

test('hamilton K4 有回路', () => {
  const g: BipGraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'A' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
    ],
  };
  const r = hamiltonCycle(g);
  assert.ok(r !== null);
  assert.equal(r!.length, 5);
  assert.equal(r![0], r![r!.length - 1]);
});

test('hamilton 不连通无回路', () => {
  const g: BipGraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'C', to: 'D' },
    ],
  };
  assert.equal(hamiltonCycle(g), null);
});
