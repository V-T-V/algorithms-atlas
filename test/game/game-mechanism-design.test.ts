import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameMechanismDesign } from '../../src/algorithms/game/game-mechanism-design/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-mechanism-design/trace.ts';

test('VCG 中标者付次高（外部性）', () => {
  const r = gameMechanismDesign([10, 25, 18]);
  assert.equal(r.winnerIdx, 1);
  assert.equal(r.payments[1], 18);
});

test('VCG 失败者不付费', () => {
  const r = gameMechanismDesign([10, 25, 18]);
  assert.equal(r.payments[0], 0);
  assert.equal(r.payments[2], 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
