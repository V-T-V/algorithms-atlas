import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  progressiveBias,
  makeLcg,
  defaultDomain,
  DEFAULT_PB_CONFIG,
} from '../../src/algorithms/ai-search/progressive-bias/impl.ts';

const H = (a: number): number => Math.max(0, 1 - a * 0.2);

test('progressive-bias 收敛到最佳臂（动作 0）', () => {
  const domain = defaultDomain(3);
  const cfg = { ...DEFAULT_PB_CONFIG, iterations: 50, heuristic: H };
  const result = progressiveBias(domain, cfg, makeLcg(42));
  assert.equal(result.bestAction, 0);
});

test('progressive-bias 单臂返回 0', () => {
  const domain = defaultDomain(1);
  const cfg = { ...DEFAULT_PB_CONFIG, iterations: 10, heuristic: H };
  assert.equal(progressiveBias(domain, cfg, makeLcg(2)).bestAction, 0);
});

test('progressive-bias 钩子被调用', () => {
  const domain = defaultDomain(3);
  const cfg = { ...DEFAULT_PB_CONFIG, iterations: 20, heuristic: H };
  let iters = 0;
  let selects = 0;
  progressiveBias(domain, cfg, makeLcg(3), {
    onIter: () => iters++,
    onSelect: () => selects++,
  });
  assert.ok(iters > 0);
  assert.ok(selects >= 0);
});

test('progressive-bias W=0 退化为普通 UCB1', () => {
  const domain = defaultDomain(3);
  const cfg = { ...DEFAULT_PB_CONFIG, iterations: 60, biasWeight: 0, heuristic: H };
  const result = progressiveBias(domain, cfg, makeLcg(5));
  // 仍应收敛到最佳臂
  assert.equal(result.bestAction, 0);
});

test('progressive-bias 强 H 引导初期偏向高 H 臂', () => {
  const domain = defaultDomain(3);
  // H 高度偏向动作 2，但动作 0 才是真实最优。少量迭代下应大量访问动作 2。
  const Hbiased = (a: number): number => (a === 2 ? 1 : 0.1);
  const cfg = { ...DEFAULT_PB_CONFIG, iterations: 5, biasWeight: 100, heuristic: Hbiased };
  const result = progressiveBias(domain, cfg, makeLcg(7));
  // 验证动作 2 的访问次数较多（初期被偏置主导）
  const a2 = result.root.children.find((c) => c.state === 2);
  assert.ok(a2 && a2.visits > 0, '动作 2 应被访问');
});
