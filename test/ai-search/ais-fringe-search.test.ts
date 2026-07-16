import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fringeSearch,
  type FringeGraph,
} from '../../src/algorithms/ai-search/ais-fringe-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-fringe-search/trace.ts';
const G: FringeGraph = {
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
test('fringe 找到目标', () => assert.deepEqual(fringeSearch(G), [0, 2]));
test('fringe trace 非空', () => assert.ok(buildTrace().length >= 2));
