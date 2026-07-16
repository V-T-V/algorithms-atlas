import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  valueIteration,
  greedyPolicy,
  bellmanBackup,
} from '../../src/algorithms/ai-search/ais-value-iteration/impl.ts';
import type { Mdp } from '../../src/algorithms/ai-search/ais-policy-iteration/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-value-iteration/trace.ts';

const mdp: Mdp = {
  states: [0, 1],
  actions: [0, 1],
  gamma: 0.9,
  transitions: {
    0: { 0: [[0, 1, 0]], 1: [[1, 1, 10]] },
    1: { 0: [[1, 1, 0]], 1: [[1, 1, 0]] },
  },
};

test('ais-value-iteration 收敛到最优', () => {
  const { V } = valueIteration(mdp, 1000, 1e-8);
  assert.ok(Math.abs(V[0]! - 10) < 0.01);
  assert.ok(Math.abs(V[1]!) < 0.01);
});

test('ais-value-iteration 贪心策略', () => {
  const { V } = valueIteration(mdp);
  const policy = greedyPolicy(mdp, V);
  assert.equal(policy[0], 1); // s0 选走向 s1
});

test('ais-value-iteration 单次备份 V(0)>0', () => {
  const V0 = new Float64Array([0, 0]);
  const { next } = bellmanBackup(mdp, V0);
  assert.ok(next[0]! > 0);
});

test('ais-value-iteration trace', () => {
  assert.ok(buildTrace().length > 2);
});
