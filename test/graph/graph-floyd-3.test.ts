import { test } from 'node:test';
import assert from 'node:assert/strict';
import { floyd } from '../../src/algorithms/graph/graph-floyd-3/impl.ts';

const INF = Number.POSITIVE_INFINITY;

test('floyd 经典例', () => {
  const adj = [
    [0, 5, INF, 10],
    [INF, 0, 3, INF],
    [INF, INF, 0, 1],
    [INF, INF, INF, 0],
  ];
  const r = floyd(4, (i, j) => adj[i]![j]!);
  assert.equal(r.dist[0]![3]!, 9);
  assert.equal(r.dist[0]![2]!, 8);
  assert.equal(r.hasNegativeCycle, false);
});

test('floyd 负环检测', () => {
  const adj = [
    [0, 1, INF],
    [INF, 0, -5],
    [2, INF, 0],
  ];
  const r = floyd(3, (i, j) => adj[i]![j]!);
  assert.equal(r.hasNegativeCycle, true);
});
