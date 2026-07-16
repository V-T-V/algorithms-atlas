import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  randomRollout,
  weightedRollout,
  makeLcg,
  type RolloutDomain,
} from '../../src/algorithms/ai-search/ais-default-policy/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-default-policy/trace.ts';

test('ais-default-policy 随机 rollout 到终局', () => {
  const domain: RolloutDomain<number> = {
    legalActions: () => [0, 1, 2],
    apply: (s, a) => s + a + 1,
    isTerminal: (s) => s >= 10,
    reward: (s) => (s >= 10 ? 1 : 0),
  };
  const r = randomRollout(0, domain, makeLcg(1));
  assert.equal(r, 1); // 必到达 >= 10
});

test('ais-default-policy 可复现（相同 seed）', () => {
  const domain: RolloutDomain<number> = {
    legalActions: () => [1, 2],
    apply: (s, a) => s + a,
    isTerminal: (s) => s >= 5,
    reward: () => 1,
  };
  const r1 = randomRollout(0, domain, makeLcg(7));
  const r2 = randomRollout(0, domain, makeLcg(7));
  assert.equal(r1, r2);
});

test('ais-default-policy 加权 rollout', () => {
  const domain: RolloutDomain<number> & { actionWeight: (s: number, a: number) => number } = {
    legalActions: () => [1, 2],
    apply: (s, a) => s + a,
    isTerminal: (s) => s >= 5,
    reward: () => 1,
    actionWeight: (s, a) => a, // 偏好大动作
  };
  const r = weightedRollout(0, domain, makeLcg(3), 100, 0.5);
  assert.equal(r, 1);
});

test('ais-default-policy maxDepth 限制', () => {
  // 永不到达终局的领域
  const domain: RolloutDomain<number> = {
    legalActions: () => [0],
    apply: (s) => s, // 不变
    isTerminal: (s) => s > 100,
    reward: () => 0,
  };
  randomRollout(0, domain, makeLcg(1), 5);
  // 不应无限循环（maxDepth=5 保护）
  assert.ok(true);
});

test('ais-default-policy trace', () => {
  assert.ok(buildTrace().length > 2);
});
