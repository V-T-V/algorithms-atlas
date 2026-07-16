import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parallelMcts,
  makeLcg,
  defaultDomain,
  DEFAULT_PM_CONFIG,
} from '../../src/algorithms/ai-search/parallel-mcts/impl.ts';

test('parallel-mcts 收敛到最佳臂（动作 0）', () => {
  const domain = defaultDomain(3);
  const result = parallelMcts(domain, { ...DEFAULT_PM_CONFIG, iterations: 100 }, makeLcg(42));
  assert.equal(result.bestAction, 0);
});

test('parallel-mcts worker rollout 总和 = iterations', () => {
  const domain = defaultDomain(3);
  const cfg = { ...DEFAULT_PM_CONFIG, iterations: 40, workers: 4 };
  const result = parallelMcts(domain, cfg, makeLcg(1));
  const total = result.workerRollouts.reduce((a, b) => a + b, 0);
  assert.equal(total, 40);
});

test('parallel-mcts 单臂问题返回 0', () => {
  const domain = defaultDomain(1);
  const result = parallelMcts(domain, { ...DEFAULT_PM_CONFIG, iterations: 10 }, makeLcg(2));
  assert.equal(result.bestAction, 0);
});

test('parallel-mcts 钩子被调用', () => {
  const domain = defaultDomain(3);
  let vlCount = 0;
  let iterCount = 0;
  parallelMcts(domain, { ...DEFAULT_PM_CONFIG, iterations: 20 }, makeLcg(3), {
    onVirtualLoss: () => vlCount++,
    onWorkerIter: () => iterCount++,
  });
  assert.ok(iterCount > 0);
  assert.ok(vlCount >= 0);
});

test('parallel-mcts virtual loss 与 undo 成对（结束时 vl=0）', () => {
  const domain = defaultDomain(3);
  const result = parallelMcts(domain, { ...DEFAULT_PM_CONFIG, iterations: 30 }, makeLcg(5));
  // 所有节点 virtual loss 应为 0（已全部 undo）
  const checkVL = (n: typeof result.root): boolean => {
    if (n.virtualLoss !== 0) return false;
    return n.children.every(checkVL);
  };
  assert.ok(checkVL(result.root), '所有节点 virtualLoss 应为 0');
});

test('parallel-mcts 不同 worker 数收敛到同一最优臂', () => {
  const domain = defaultDomain(3);
  const r1 = parallelMcts(domain, { ...DEFAULT_PM_CONFIG, iterations: 60, workers: 1 }, makeLcg(7));
  const r4 = parallelMcts(domain, { ...DEFAULT_PM_CONFIG, iterations: 60, workers: 4 }, makeLcg(7));
  assert.equal(r1.bestAction, 0);
  assert.equal(r4.bestAction, 0);
});
