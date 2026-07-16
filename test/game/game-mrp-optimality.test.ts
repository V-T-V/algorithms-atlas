import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mrpValue } from '../../src/algorithms/game/game-mrp-optimality/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-mrp-optimality/trace.ts';
test('MRP 吸收态价值为 R', () => {
  const V = mrpValue(
    [
      [0, 1],
      [0, 1],
    ],
    [1, 5],
    0.9,
    200,
  );
  assert.ok(Math.abs(V[1]! - 5) < 0.5);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
