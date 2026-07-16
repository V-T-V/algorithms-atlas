import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tdZero, type TdDomain } from '../../src/algorithms/ai-search/ais-reinforcement-td/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-reinforcement-td/trace.ts';

const makeRng = (seed = 42) => {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
};

test('ais-reinforcement-td 收敛到真值', () => {
  // 链 0 --r=0--> 1 --r=1--> 2(终止). V(2)=0, V(1)=1, V(0)=γ·1=0.9
  const domain: TdDomain = {
    states: [0, 1, 2],
    start: () => 0,
    step: (s) => {
      if (s === 0) return [1, 0, false] as const;
      if (s === 1) return [2, 1, true] as const;
      return [s, 0, true] as const;
    },
  };
  const V = tdZero(domain, {
    gamma: 0.9,
    alpha: 0.3,
    episodes: 1000,
    maxSteps: 10,
    rng: makeRng(),
  });
  assert.ok(Math.abs(V[1]! - 1) < 0.05, `V(1)=${V[1]}`);
  assert.ok(Math.abs(V[0]! - 0.9) < 0.05, `V(0)=${V[0]}`);
});

test('ais-reinforcement-td 多步链价值递减', () => {
  // 链 0->1->2(终止,r=1)
  const domain: TdDomain = {
    states: [0, 1, 2],
    start: () => 0,
    step: (s) => [s + 1, s === 1 ? 1 : 0, s === 1] as const,
  };
  const V = tdZero(domain, {
    gamma: 0.5,
    alpha: 0.3,
    episodes: 500,
    maxSteps: 10,
    rng: makeRng(7),
  });
  assert.ok(V[0]! > 0 && V[1]! > V[0]!);
});

test('ais-reinforcement-td trace', () => {
  assert.ok(buildTrace().length > 2);
});
