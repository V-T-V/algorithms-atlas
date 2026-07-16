import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dijkstraGreedy } from '../../src/algorithms/greedy/dijkstra-greedy/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/greedy/dijkstra-greedy/trace.ts';

test('dijkstraGreedy 已知最短路', () => {
  const graph = [
    [
      { to: 1, weight: 4 },
      { to: 2, weight: 1 },
    ],
    [{ to: 3, weight: 1 }],
    [
      { to: 1, weight: 2 },
      { to: 3, weight: 5 },
    ],
    [],
  ];
  const { dist } = dijkstraGreedy(graph, 0);
  assert.deepEqual(dist, [0, 3, 1, 4]);
});

test('dijkstraGreedy 不可达点为 Infinity', () => {
  const graph = [[{ to: 1, weight: 2 }], []];
  const { dist } = dijkstraGreedy(graph, 1);
  assert.equal(dist[0], Infinity);
  assert.equal(dist[1], 0);
});

test('dijkstraGreedy 钩子触发', () => {
  let settled = 0;
  dijkstraGreedy([[], []], 0, { onSettle: () => settled++ });
  assert.equal(settled, 1);
});

test('buildTrace 含 dist', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
