import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mcts, makeLcg, defaultDomain } from '../../src/algorithms/ai-search/mcts/impl.ts';

test('mcts 收敛到最优动作（动作 0）', () => {
  const d = defaultDomain(3);
  // 动作 0 真实奖励最高（0.9），应被访问最多并成为推荐
  const r = mcts(d, 60, makeLcg(42));
  assert.equal(r.bestAction, 0);
  const counts = r.root.children.map((c) => c.visits);
  assert.equal(counts.indexOf(Math.max(...counts)), 0, '动作 0 访问次数应最多');
});

test('mcts 固定种子可复现', () => {
  const d = defaultDomain(3);
  const a = mcts(d, 30, makeLcg(7));
  const b = mcts(d, 30, makeLcg(7));
  assert.equal(a.bestAction, b.bestAction);
  assert.deepEqual(
    a.root.children.map((c) => c.visits),
    b.root.children.map((c) => c.visits),
  );
});

test('mcts 访问次数之和等于迭代次数', () => {
  const d = defaultDomain(4);
  const r = mcts(d, 40, makeLcg(1));
  const sum = r.root.children.reduce((s, c) => s + c.visits, 0);
  // 每次迭代都会回传到根的某个子节点
  assert.equal(sum, 40);
});

test('mcts 钩子四阶段都被调用', () => {
  const d = defaultDomain(2);
  let selects = 0;
  let expands = 0;
  let simulates = 0;
  let backprops = 0;
  mcts(d, 20, makeLcg(5), {
    onSelect: () => selects++,
    onExpand: () => expands++,
    onSimulate: () => simulates++,
    onBackprop: () => backprops++,
  });
  assert.equal(selects, 20);
  assert.equal(simulates, 20);
  assert.equal(backprops, 20);
  assert.ok(expands > 0, '至少有一次扩展');
});

test('mcts 奖励与真实期望同序', () => {
  const d = defaultDomain(3);
  const r = mcts(d, 80, makeLcg(99));
  const avg = r.root.children.map((c) => (c.visits > 0 ? c.totalReward / c.visits : 0));
  // 动作 0 平均奖励最高，动作 2 最低
  assert.ok(avg[0]! > avg[1]!, '动作 0 平均奖励应高于动作 1');
  assert.ok(avg[1]! > avg[2]!, '动作 1 平均奖励应高于动作 2');
});
