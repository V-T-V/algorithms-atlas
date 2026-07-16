import { test } from 'node:test';
import assert from 'node:assert/strict';
import { condorcetParadox } from '../../src/algorithms/game/game-voting-paradox/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-voting-paradox/trace.ts';
test('经典构造产生循环', () => {
  const r = condorcetParadox(
    [
      [0, 1, 2],
      [1, 2, 0],
      [2, 0, 1],
    ],
    3,
  );
  assert.equal(r.hasCycle, true);
});
test('一致偏好无循环', () => {
  const r = condorcetParadox(
    [
      [0, 1, 2],
      [0, 1, 2],
      [0, 1, 2],
    ],
    3,
  );
  assert.equal(r.hasCycle, false);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
