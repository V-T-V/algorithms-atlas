import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mixedNash } from '../../src/algorithms/game/game-pure-mixed-nash/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-pure-mixed-nash/trace.ts';
test('匹配硬币混合纳什 p=0.5', () => {
  const r = mixedNash([
    [1, -1],
    [-1, 1],
  ]);
  assert.ok(Math.abs(r.p - 0.5) < 1e-9);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
