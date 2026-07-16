import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  gameRepeatedGame,
  TIT_FOR_TAT,
  ALWAYS_DEFECT,
  ALWAYS_COOPERATE,
} from '../../src/algorithms/game/game-repeated-game/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-repeated-game/trace.ts';

test('TFT vs AllD：TFT 第 1 轮 C，之后全部 D', () => {
  const r = gameRepeatedGame(TIT_FOR_TAT, ALWAYS_DEFECT, 5);
  assert.equal(r.history[0]!.a1, 'C');
  for (let i = 1; i < r.history.length; i++) assert.equal(r.history[i]!.a1, 'D');
});

test('TFT vs AlwaysC：双方全程合作', () => {
  const r = gameRepeatedGame(TIT_FOR_TAT, ALWAYS_COOPERATE, 5);
  for (const h of r.history) {
    assert.equal(h.a1, 'C');
    assert.equal(h.a2, 'C');
  }
  assert.equal(r.totalU1, 15);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 5);
});
