import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  maximumIndependentSet,
  type GraphInput,
} from '../../src/algorithms/graph/maximum-independent-set/impl.ts';

const isIndependent = (g: GraphInput, set: string[]): boolean => {
  const adj = new Map<string, Set<string>>();
  for (const n of g.nodes) adj.set(n, new Set());
  for (const e of g.edges) {
    adj.get(e.from)!.add(e.to);
    adj.get(e.to)!.add(e.from);
  }
  for (let i = 0; i < set.length; i++) {
    for (let j = i + 1; j < set.length; j++) {
      if (adj.get(set[i]!)!.has(set[j]!)) return false;
    }
  }
  return true;
};

test('mis 路径 P5', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'E' },
    ],
  };
  const { set, size } = maximumIndependentSet(g);
  assert.equal(size, 3);
  assert.ok(isIndependent(g, set));
});

test('mis 三角形为 1', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  assert.equal(maximumIndependentSet(g).size, 1);
});

test('mis 无边图为全部', () => {
  const g: GraphInput = { nodes: ['A', 'B', 'C'], edges: [] };
  assert.equal(maximumIndependentSet(g).size, 3);
});

test('mis 五边形为 2', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'E' },
      { from: 'E', to: 'A' },
    ],
  };
  assert.equal(maximumIndependentSet(g).size, 2);
});

test('mis 空图', () => {
  assert.equal(maximumIndependentSet({ nodes: [], edges: [] }).size, 0);
});

test('mis 钩子', () => {
  let updates = 0;
  maximumIndependentSet({ nodes: ['A', 'B', 'C'], edges: [] }, { onUpdate: () => updates++ });
  assert.ok(updates >= 1);
});
