import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  landmarkShortestPath,
  precomputeLandmarks,
} from '../../src/algorithms/graph/graph-landmark/impl.ts';

const G = {
  nodes: ['S', 'A', 'B', 'C', 'D', 'T'],
  edges: [
    { from: 'S', to: 'A', weight: 4 },
    { from: 'S', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'C', weight: 8 },
    { from: 'B', to: 'D', weight: 10 },
    { from: 'C', to: 'D', weight: 2 },
    { from: 'C', to: 'T', weight: 6 },
    { from: 'D', to: 'T', weight: 3 },
  ],
};

test('landmark 最短路 S->T', () => {
  const pre = precomputeLandmarks(G, ['S', 'T']);
  const r = landmarkShortestPath(G, pre, 'S', 'T');
  // S-B(2)-C? no S-B then B-C(8)=10... S-A(4)-C(5)-D(2)-T(3)=14; S-B(2)-C(8)-D(2)-T(3)=15; S-A-C-T=4+5+6=15
  // 最优 = S-A-C-D-T = 4+5+2+3 = 14
  assert.equal(r.found, true);
  assert.equal(r.dist, 14);
});

test('landmark 起点终点相同', () => {
  const pre = precomputeLandmarks(G, ['S']);
  const r = landmarkShortestPath(G, pre, 'S', 'S');
  assert.equal(r.dist, 0);
});

test('landmark 相邻', () => {
  const pre = precomputeLandmarks(G, ['S', 'C']);
  const r = landmarkShortestPath(G, pre, 'S', 'A');
  assert.equal(r.dist, 4);
});

test('landmark 启发 admissible（不超过真值）', () => {
  const pre = precomputeLandmarks(G, ['S', 'T', 'C']);
  // S->D 真值 = min(S-A-C-D=11, S-B-C-D=12, S-B-D=12) = 11
  const r = landmarkShortestPath(G, pre, 'S', 'D');
  assert.equal(r.dist, 11);
});
