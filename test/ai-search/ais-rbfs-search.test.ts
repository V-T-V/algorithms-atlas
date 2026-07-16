import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rbfsSearch, type RbfsGraph } from '../../src/algorithms/ai-search/ais-rbfs-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-rbfs-search/trace.ts';
const G: RbfsGraph = {
  start: 0,
  goal: 2,
  neighbors: (n) =>
    n === 0
      ? [
          { to: 1, cost: 1 },
          { to: 2, cost: 5 },
        ]
      : [],
  h: (n) => [2, 1, 0][n] ?? 0,
};
test('rbfs 找到目标', () => assert.deepEqual(rbfsSearch(G), [0, 2]));
test('rbfs trace 非空', () => assert.ok(buildTrace().length >= 2));
