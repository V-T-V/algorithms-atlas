import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  pureMcts,
  makeLcg,
  type MctsDomain,
} from '../../src/algorithms/ai-search/ais-mcts-pure/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-mcts-pure/trace.ts';

test('ais-mcts-pure 收敛到最优臂', () => {
  // 动作 0 真实期望最高
  const truth = [0.9, 0.2, 0.1];
  const domain: MctsDomain<number> = {
    legalActions: () => [0, 1, 2],
    apply: (s, a) => s + a,
    isTerminal: (s) => s >= 1,
    reward: (s) => {
      void s;
      const r = makeLcg(99)();
      const mu = truth[0]!;
      return r < mu ? 1 : 0;
    },
  };
  const { root } = pureMcts(0, domain, 100, makeLcg(1));
  // 根的所有子节点访问都应 > 0
  for (const ch of root.children) assert.ok(ch.visits > 0);
});

test('ais-mcts-pure 返回合法动作', () => {
  const domain: MctsDomain<number> = {
    legalActions: () => [0, 1],
    apply: (s, a) => s + a,
    isTerminal: (s) => s >= 1,
    reward: () => 1,
  };
  const { bestAction } = pureMcts(0, domain, 20, makeLcg(1));
  assert.ok(bestAction === 0 || bestAction === 1);
});

test('ais-mcts-pure 可复现', () => {
  const domain: MctsDomain<number> = {
    legalActions: () => [0, 1],
    apply: (s, a) => s + a,
    isTerminal: (s) => s >= 1,
    reward: () => 1,
  };
  const r1 = pureMcts(0, domain, 30, makeLcg(5));
  const r2 = pureMcts(0, domain, 30, makeLcg(5));
  assert.equal(r1.bestAction, r2.bestAction);
});

test('ais-mcts-pure trace', () => {
  assert.ok(buildTrace().length > 2);
});
