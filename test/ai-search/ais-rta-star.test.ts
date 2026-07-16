import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rtaStarSearch, type RtaGraph } from '../../src/algorithms/ai-search/ais-rta-star/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-rta-star/trace.ts';
const G: RtaGraph = {
  start: 0,
  goal: 2,
  neighbors: (n) => (n === 0 ? [1, 2] : []),
  h0: (n) => [2, 1, 0][n] ?? 0,
};
test('rta 找到目标', () => assert.equal(rtaStarSearch(G, 10).at(-1), 2));
test('rta trace 非空', () => assert.ok(buildTrace().length >= 2));
