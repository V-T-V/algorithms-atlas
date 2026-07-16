import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  qLearn,
  qToPolicy,
  epsilonGreedy,
  initQ,
} from '../../src/algorithms/ai-search/ais-q-learning-simple/impl.ts';
import type { QDomain } from '../../src/algorithms/ai-search/ais-q-learning-simple/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-q-learning-simple/trace.ts';

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

test('ais-q-learning 学到贪心走 s0->s1', () => {
  const Q = qLearn(domain, {
    gamma: 0.9,
    alpha: 0.3,
    epsilon: 0.3,
    episodes: 500,
    maxSteps: 8,
    rng: makeRng(),
  });
  const policy = qToPolicy(Q, domain.states, domain.actions);
  assert.equal(policy[0], 1);
});

test('ais-q-learning Q(s1,*) > 0', () => {
  const Q = qLearn(domain, {
    gamma: 0.9,
    alpha: 0.3,
    epsilon: 0.3,
    episodes: 500,
    maxSteps: 8,
    rng: makeRng(7),
  });
  assert.ok(Q[1]![0]! > 0);
});

test('ais-q-learning epsilon=0 选最大', () => {
  const Q = initQ(2, 2);
  Q[1]![0] = 5;
  Q[1]![1] = 1;
  const a = epsilonGreedy(Q, 1, [0, 1], 0, () => 0.99);
  assert.equal(a, 0);
});

test('ais-q-learning epsilon=1 随机仍合法', () => {
  const Q = initQ(2, 2);
  Q[1]![0] = 5;
  const a = epsilonGreedy(Q, 1, [0, 1], 1, () => 0.3);
  assert.ok(a === 0 || a === 1);
});

test('ais-q-learning trace', () => {
  assert.ok(buildTrace().length > 2);
});
