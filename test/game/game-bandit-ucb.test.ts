import { test } from 'node:test';
import assert from 'node:assert/strict';
import { banditUcb } from '../../src/algorithms/game/game-bandit-ucb/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-bandit-ucb/trace.ts';
test('UCB 更偏向高均值臂', () => {
  const R = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const sel = banditUcb(R);
  const arm0 = sel.filter((s) => s === 0).length;
  assert.ok(arm0 >= 5);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
