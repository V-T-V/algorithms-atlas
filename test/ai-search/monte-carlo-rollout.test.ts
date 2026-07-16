import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  monteCarloRollout,
  makeLcg,
  nimSum,
  nimIsTerminal,
} from '../../src/algorithms/ai-search/monte-carlo-rollout/impl.ts';

test('rollout 总次数 = wins + losses + draws', () => {
  const r = monteCarloRollout([3, 2], 50, 42);
  assert.equal(r.total, 50);
  assert.equal(r.wins + r.losses + r.draws, 50);
});

test('rollout 胜率 ∈ [0,1]', () => {
  const r = monteCarloRollout([1, 2, 3], 100, 7);
  assert.ok(r.winRate >= 0 && r.winRate <= 1);
});

test('rollout 固定种子可复现', () => {
  const a = monteCarloRollout([3, 2], 60, 42);
  const b = monteCarloRollout([3, 2], 60, 42);
  assert.deepEqual(a, b);
});

test('rollout 单子局面 [1] 必胜（首玩家直接取完）', () => {
  // [1]：首玩家取走唯一一颗 → 终局，轮到对手面对空 → 首玩家胜
  const r = monteCarloRollout([1], 20, 1);
  assert.equal(r.wins, 20);
  assert.equal(r.losses, 0);
  assert.equal(r.winRate, 1);
});

test('rollout 必胜局面（[1]，一步赢）胜率高于必败局面（[1,1]，镜像后手赢）', () => {
  // [1]：先手直接取走唯一一颗 → 先手 100% 胜
  // [1,1]：先手只能从某堆取 1 → [0,1]，后手取最后一颗 → 先手面对空盘输 → 先手 0% 胜
  // 这两组在纯随机 rollout 下也是确定性的（无选择空间）
  const rWin = monteCarloRollout([1], 200, 42);
  const rLose = monteCarloRollout([1, 1], 200, 42);
  assert.ok(
    rWin.winRate > rLose.winRate,
    `[1] 胜率 ${rWin.winRate} 应高于 [1,1] 胜率 ${rLose.winRate}`,
  );
  assert.equal(rWin.winRate, 1, '[1] 应 100% 胜');
  assert.equal(rLose.winRate, 0, '[1,1] 应 0% 胜');
});

test('rollout 钩子被调用且次数正确', () => {
  let count = 0;
  monteCarloRollout([2, 1], 30, 5, {
    onRollout: () => count++,
  });
  assert.equal(count, 30);
});

test('rollout 终局检测', () => {
  assert.ok(nimIsTerminal([0, 0, 0]));
  assert.ok(!nimIsTerminal([0, 1, 0]));
});

test('rollout Nim-和计算', () => {
  assert.equal(nimSum([1, 2, 3]), 0);
  assert.equal(nimSum([3, 2]), 1);
});

test('rollout makeLcg 产生 [0,1) 范围值', () => {
  const rng = makeLcg(123);
  for (let i = 0; i < 100; i++) {
    const v = rng();
    assert.ok(v >= 0 && v < 1, `rng 输出 ${v} 超出 [0,1)`);
  }
});
