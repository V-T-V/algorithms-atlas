import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  weightedAStar,
  type WaGraph,
} from '../../src/algorithms/ai-search/ais-weighted-a-star/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-weighted-a-star/trace.ts';
const G: WaGraph = {
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
test('wa-star 找到目标', () => assert.deepEqual(weightedAStar(G, 2), [0, 2]));
test('wa-star trace 非空', () => assert.ok(buildTrace().length >= 2));
