import { test } from 'node:test';
import assert from 'node:assert/strict';
import { treeCentroid, type GraphInput } from '../../src/algorithms/graph/tree-centroid/impl.ts';

test('tree-centroid 链 7 节点 → 1 个重心', () => {
  // 1-2-3-4-5-6-7：n=7, limit=3。重心为节点 4（左3 右3，maxPart=3）
  const g: GraphInput = {
    nodes: ['1', '2', '3', '4', '5', '6', '7'],
    edges: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
      { from: '4', to: '5' },
      { from: '5', to: '6' },
      { from: '6', to: '7' },
    ],
  };
  const { centroids, maxPart } = treeCentroid(g);
  assert.deepEqual(centroids, ['4']);
  assert.equal(maxPart.get('4'), 3);
});

test('tree-centroid 链 6 节点 → 2 个重心', () => {
  // 1-2-3-4-5-6：n=6, limit=3。重心为 3 与 4
  const g: GraphInput = {
    nodes: ['1', '2', '3', '4', '5', '6'],
    edges: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
      { from: '4', to: '5' },
      { from: '5', to: '6' },
    ],
  };
  const { centroids } = treeCentroid(g);
  assert.deepEqual(centroids, ['3', '4']);
});

test('tree-centroid 星形 → 中心是重心', () => {
  const g: GraphInput = {
    nodes: ['C', 'a', 'b', 'c', 'd'],
    edges: [
      { from: 'C', to: 'a' },
      { from: 'C', to: 'b' },
      { from: 'C', to: 'c' },
      { from: 'C', to: 'd' },
    ],
  };
  const { centroids, maxPart } = treeCentroid(g);
  assert.deepEqual(centroids, ['C']);
  assert.equal(maxPart.get('C'), 1);
});

test('tree-centroid 单点', () => {
  const { centroids } = treeCentroid({ nodes: ['X'], edges: [] });
  assert.deepEqual(centroids, ['X']);
});

test('tree-centroid 钩子被调用', () => {
  const g: GraphInput = {
    nodes: ['1', '2', '3', '4'],
    edges: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '2', to: '4' },
    ],
  };
  const visits: string[] = [];
  const cands: string[] = [];
  let doneCount = 0;
  treeCentroid(g, {
    onVisit: (u) => visits.push(u),
    onCandidate: (u) => cands.push(u),
    onCentroids: () => {
      doneCount++;
    },
  });
  assert.equal(visits.length, 4);
  assert.ok(cands.length >= 1);
  assert.equal(doneCount, 1);
});
