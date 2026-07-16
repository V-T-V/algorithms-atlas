import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  randomWalkSearch,
  type RwGraph,
} from '../../src/algorithms/ai-search/ais-random-walk-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-random-walk-search/trace.ts';
const G: RwGraph = { start: 0, goal: 1, neighbors: (n) => [1], rand: () => 0 };
test('rw 直达目标', () => assert.equal(randomWalkSearch(G, 5).at(-1), 1));
test('rw trace 非空', () => assert.ok(buildTrace().length >= 2));
