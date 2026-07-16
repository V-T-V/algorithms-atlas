import { test } from 'node:test';
import assert from 'node:assert/strict';
import { smaStarSearch, type SmaGraph } from '../../src/algorithms/ai-search/ais-sma-star/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-sma-star/trace.ts';
const G: SmaGraph = {
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
test('sma-star 找到目标', () => assert.deepEqual(smaStarSearch(G, 8), [0, 2]));
test('sma-star trace 非空', () => assert.ok(buildTrace().length >= 2));
