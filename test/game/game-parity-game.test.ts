import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parityWinner, type ParityGame } from '../../src/algorithms/game/game-parity-game/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-parity-game/trace.ts';
test('最大偶优先级 Even 胜', () => {
  const g: ParityGame = { n: 2, owner: ['E', 'O'], prio: [2, 1], succ: [[1], [0]] };
  const w = parityWinner(g);
  assert.equal(w[0], 'E');
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
