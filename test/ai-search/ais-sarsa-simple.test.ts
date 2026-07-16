import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sarsa } from '../../src/algorithms/ai-search/ais-sarsa-simple/impl.ts';
import { qToPolicy } from '../../src/algorithms/ai-search/ais-q-learning-simple/impl.ts';
import type { QDomain } from '../../src/algorithms/ai-search/ais-q-learning-simple/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-sarsa-simple/trace.ts';

const makeRng = (seed = 42) => {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
};

const domain: QDomain = {
  states: [0, 1],
  actions: [0, 1],
  start: () => 0,
  step: (s, a) => {
    if (s === 0) return a === 1 ? ([1, 0, false] as const) : ([0, 0, false] as const);
    return [1, 1, false] as const;
  },
};

test('ais-sarsa 学到 s0 选 a1', () => {
  const Q = sarsa(domain, {
    gamma: 0.9,
    alpha: 0.3,
    epsilon: 0.2,
    episodes: 500,
    maxSteps: 8,
    rng: makeRng(),
  });
  const policy = qToPolicy(Q, domain.states, domain.actions);
  assert.equal(policy[0], 1);
});

test('ais-sarsa Q(s1,*)>0', () => {
  const Q = sarsa(domain, {
    gamma: 0.9,
    alpha: 0.3,
    epsilon: 0.2,
    episodes: 500,
    maxSteps: 8,
    rng: makeRng(7),
  });
  assert.ok(Q[1]![0]! > 0);
});

test('ais-sarsa 零回合 Q=0', () => {
  const Q = sarsa(domain, {
    gamma: 0.9,
    alpha: 0.3,
    epsilon: 0.2,
    episodes: 0,
    maxSteps: 8,
    rng: makeRng(),
  });
  assert.equal(Q[0]![0]!, 0);
});

test('ais-sarsa trace', () => {
  assert.ok(buildTrace().length > 2);
});
