import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  idaStarSearch,
  type IdaGraph,
} from '../../src/algorithms/ai-search/ais-ida-star-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-ida-star-search/trace.ts';
const G: IdaGraph = {
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
test('ida-star 找到目标', () => {
  assert.deepEqual(idaStarSearch(G), [0]);
});
test('ida-star trace 非空', () => assert.ok(buildTrace().length >= 2));
