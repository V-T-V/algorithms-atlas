import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bertrandDuopoly } from '../../src/algorithms/game/game-bertrand/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-bertrand/trace.ts';
test('伯特兰均衡价格等于成本', () => {
  const r = bertrandDuopoly(10, 2);
  assert.equal(r.p1, 2);
  assert.equal(r.profit, 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
