import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  qLearningTable,
  type QlProblem,
} from '../../src/algorithms/ai-search/ais-q-learning-table/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-q-learning-table/trace.ts';
const P: QlProblem = {
  states: [0, 1],
  actions: [0, 1],
  episodes: 50,
  maxSteps: 3,
  alpha: 0.5,
  gamma: 0.9,
  epsilon: 0.1,
  rand: () => 0,
  step: (s, a) =>
    s === 0 ? { s2: a, r: a === 1 ? 1 : 0, done: a === 1 } : { s2: 1, r: 0, done: true },
};
test('ql 学习偏向动作1', () => {
  const Q = qLearningTable(P);
  assert.ok(Q[0]![1]! >= Q[0]![0]!);
});
test('ql trace 非空', () => assert.ok(buildTrace().length >= 2));
