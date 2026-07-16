import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bayesianNash } from '../../src/algorithms/game/game-bayesian-nash/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-bayesian-nash/trace.ts';
test('BNE 均衡近似成立', () => {
  assert.equal(bayesianNash(2, [0.5]), true);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
