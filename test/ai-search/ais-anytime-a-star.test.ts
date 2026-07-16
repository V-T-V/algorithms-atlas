import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  anytimeAStar,
  type AraGraph,
} from '../../src/algorithms/ai-search/ais-anytime-a-star/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-anytime-a-star/trace.ts';
const G: AraGraph = {
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
test('anytime 找到目标', () => assert.deepEqual(anytimeAStar(G, 2, 1, 0.5), [0, 2]));
test('anytime trace 非空', () => assert.ok(buildTrace().length >= 2));
