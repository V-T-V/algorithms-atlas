import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coreImputation } from '../../src/algorithms/game/game-core-imputation/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-core-imputation/trace.ts';
test('超加分配在核心', () => {
  const v = (S: number[]) => (S.length >= 3 ? 3 : 0);
  assert.equal(coreImputation(v, [1, 1, 1], 3), true);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
