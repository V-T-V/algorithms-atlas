import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameCooperative } from '../../src/algorithms/game/game-cooperative/impl.ts';

test('game-cooperative 对称玩家 Shapley 相等', () => {
  const v = (m: number): number => {
    let c = 0;
    for (let i = 0; i < 3; i++) if (m & (1 << i)) c++;
    return c * c;
  };
  const sh = gameCooperative(3, v);
  assert.ok(Math.abs(sh[0]! - sh[1]!) < 1e-9);
  assert.ok(Math.abs(sh[1]! - sh[2]!) < 1e-9);
});

test('game-cooperative Shapley 之和等于大联盟价值', () => {
  const v = (m: number): number => {
    let c = 0;
    for (let i = 0; i < 3; i++) if (m & (1 << i)) c++;
    return c * c;
  };
  const sh = gameCooperative(3, v);
  const total = sh.reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(total - v(7)) < 1e-9); // 全联盟 mask=111=7, v=9
});

test('game-cooperative 单玩家 Shapley = v({1})', () => {
  const v = (m: number): number => (m === 1 ? 5 : 0);
  assert.equal(gameCooperative(1, v)[0], 5);
});
