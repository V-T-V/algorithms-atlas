import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  spfaNegativeCycle,
  type GraphInput,
} from '../../src/algorithms/graph/spfa-negative-cycle/impl.ts';

test('spfa-negative-cycle 检测到负环', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: -2 },
      { from: 'C', to: 'A', weight: -2 },
    ],
  };
  const { hasNegativeCycle } = spfaNegativeCycle(g);
  assert.equal(hasNegativeCycle, true);
});

test('spfa-negative-cycle 无负环（正权图）', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 2 },
    ],
  };
  const { hasNegativeCycle } = spfaNegativeCycle(g);
  assert.equal(hasNegativeCycle, false);
});

test('spfa-negative-cycle 有负边但无负环', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: -1 },
      { from: 'B', to: 'C', weight: -1 },
      { from: 'A', to: 'C', weight: 5 },
    ],
  };
  const { hasNegativeCycle } = spfaNegativeCycle(g);
  assert.equal(hasNegativeCycle, false);
});

test('spfa-negative-cycle 空图无负环', () => {
  const { hasNegativeCycle } = spfaNegativeCycle({ nodes: [], edges: [] });
  assert.equal(hasNegativeCycle, false);
});

test('spfa-negative-cycle 自环负权是负环', () => {
  const g: GraphInput = {
    nodes: ['A'],
    edges: [{ from: 'A', to: 'A', weight: -1 }],
  };
  const { hasNegativeCycle } = spfaNegativeCycle(g);
  assert.equal(hasNegativeCycle, true);
});
