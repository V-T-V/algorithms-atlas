import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rrtSearch, type RrtProblem } from '../../src/algorithms/ai-search/ais-rrt-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-rrt-search/trace.ts';
const P: RrtProblem = { start: [0, 0], goal: [1, 1], sample: () => [1, 1], step: 2, threshold: 2 };
test('rrt 路径含起点', () => assert.equal(rrtSearch(P, 5)[0], 0));
test('rrt trace 非空', () => assert.ok(buildTrace().length >= 2));
