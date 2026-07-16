import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyDijkstra3 } from '../../src/algorithms/greedy/greedy-dijkstra-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-dijkstra-3/trace.ts';

test('Dijkstra 基本最短路径', () => {
  const G = [
    [0, 4, 1, 0],
    [4, 0, 2, 5],
    [1, 2, 0, 3],
    [0, 5, 3, 0],
  ];
  const r = greedyDijkstra3(G, 0);
  assert.deepEqual(r.dist, [0, 3, 1, 4]);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
