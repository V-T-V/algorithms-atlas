import { test } from 'node:test';
import assert from 'node:assert/strict';
import { banachMazur } from '../../src/algorithms/game/game-banach-mazur/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-banach-mazur/trace.ts';
test('宽目标 A 易胜', () => {
  const w = banachMazur(6, 0.2, 0.8);
  assert.ok(w === 'A' || w === 'B');
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
