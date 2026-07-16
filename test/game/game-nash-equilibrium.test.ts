import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameNashEquilibrium } from '../../src/algorithms/game/game-nash-equilibrium/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-nash-equilibrium/trace.ts';

test('猜硬币混合纳什 p=q=0.5', () => {
  const r = gameNashEquilibrium(
    [
      [1, -1],
      [-1, 1],
    ],
    [
      [-1, 1],
      [1, -1],
    ],
  );
  assert.ok(r.valid);
  assert.ok(Math.abs(r.p - 0.5) < 1e-9);
  assert.ok(Math.abs(r.q - 0.5) < 1e-9);
});

test('猜硬币博弈值为 0', () => {
  const r = gameNashEquilibrium(
    [
      [1, -1],
      [-1, 1],
    ],
    [
      [-1, 1],
      [1, -1],
    ],
  );
  assert.ok(Math.abs(r.rowValue) < 1e-9);
  assert.ok(Math.abs(r.colValue) < 1e-9);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
