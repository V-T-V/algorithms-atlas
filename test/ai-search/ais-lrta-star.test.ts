import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  lrtaStarSearch,
  type LrtaGraph,
} from '../../src/algorithms/ai-search/ais-lrta-star/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-lrta-star/trace.ts';
const G: LrtaGraph = {
  start: 0,
  goal: 2,
  neighbors: (n) => (n === 0 ? [1, 2] : []),
  h0: (n) => [2, 1, 0][n] ?? 0,
};
test('lrta 找到目标', () => assert.equal(lrtaStarSearch(G, 10).at(-1), 2));
test('lrta trace 非空', () => assert.ok(buildTrace().length >= 2));
