import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tdZero, type TdProblem } from '../../src/algorithms/ai-search/ais-td-zero/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-td-zero/trace.ts';
const P: TdProblem = {
  states: [0, 1],
  policy: () => 0,
  step: (s) => (s === 0 ? { s2: 1, r: 1, done: false } : { s2: 1, r: 0, done: true }),
  episodes: 30,
  maxSteps: 3,
  alpha: 0.5,
  gamma: 0.9,
};
test('td0 V[0] 为正', () => assert.ok(tdZero(P)[0]! > 0));
test('td0 trace 非空', () => assert.ok(buildTrace().length >= 2));
