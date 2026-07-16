import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  policyIterationExact,
  type PiMdp,
} from '../../src/algorithms/ai-search/ais-policy-iteration-exact/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-policy-iteration-exact/trace.ts';
const M: PiMdp = {
  states: [0, 1],
  actions: [0, 1],
  gamma: 0.9,
  theta: 1e-3,
  trans: (s, a) =>
    s === 0 ? [{ to: a, prob: 1, reward: a === 1 ? 1 : 0 }] : [{ to: 1, prob: 1, reward: 0 }],
};
test('pi 返回稳定策略', () => {
  const p = policyIterationExact(M);
  assert.equal(p.length, 2);
});
test('pi trace 非空', () => assert.ok(buildTrace().length >= 2));
