import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  policyIteration,
  policyEvaluate,
  policyImprove,
  type Mdp,
} from '../../src/algorithms/ai-search/ais-policy-iteration/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-policy-iteration/trace.ts';

/** 经典 2 状态：s0 选择 a=0 留在原地 r=0；选择 a=1 走到 s1 r=10。 */
const mdp: Mdp = {
  states: [0, 1],
  actions: [0, 1],
  gamma: 0.9,
  transitions: {
    0: { 0: [[0, 1, 0]], 1: [[1, 1, 10]] },
    1: { 0: [[1, 1, 0]], 1: [[1, 1, 0]] },
  },
};

test('ais-policy-iteration 求最优策略', () => {
  const { policy, V } = policyIteration(mdp);
  // 最优：s0 应选 a=1（走到 s1 拿 10），V(0)=10
  assert.equal(policy[0], 1);
  assert.ok(Math.abs(V[0]! - 10) < 0.1);
});

test('ais-policy-iteration 评估给定策略', () => {
  const policy = [0, 0]; // 永远留在原地
  const V = new Float64Array(2);
  policyEvaluate(mdp, policy, V);
  assert.ok(Math.abs(V[0]!) < 1e-6);
  assert.ok(Math.abs(V[1]!) < 1e-6);
});

test('ais-policy-iteration 改进会变更策略', () => {
  const V = new Float64Array([0, 0]);
  const policy = [0, 0];
  const changed = policyImprove(mdp, V, policy);
  assert.ok(changed >= 1);
  assert.equal(policy[0], 1);
});

test('ais-policy-iteration trace', () => {
  assert.ok(buildTrace().length > 2);
});
