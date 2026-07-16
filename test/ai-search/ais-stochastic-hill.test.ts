import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  stochasticHill,
  type ShcProblem,
} from '../../src/algorithms/ai-search/ais-stochastic-hill/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-stochastic-hill/trace.ts';
const P: ShcProblem = {
  start: 0,
  eval: (x) => -Math.abs(x - 3) + 9,
  neighbors: (x) => [x + 1],
  rand: () => 0,
};
test('shc 单调上升', () => assert.equal(stochasticHill(P, 3), 3));
test('shc trace 非空', () => assert.ok(buildTrace().length >= 2));
