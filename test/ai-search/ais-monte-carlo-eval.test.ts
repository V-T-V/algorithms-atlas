import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  monteCarloEval,
  type McProblem,
} from '../../src/algorithms/ai-search/ais-monte-carlo-eval/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-monte-carlo-eval/trace.ts';
const P: McProblem = {
  states: [0, 1],
  policy: () => 0,
  step: (s) => (s === 0 ? { s2: 1, r: 1, done: false } : { s2: 1, r: 0, done: true }),
  episodes: 30,
  maxSteps: 3,
  gamma: 1,
};
test('mc V[0]=1', () => assert.equal(monteCarloEval(P)[0], 1));
test('mc trace 非空', () => assert.ok(buildTrace().length >= 2));
