import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ellsbergAnalysis } from '../../src/algorithms/game/game-elsberg-paradox/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-elsberg-paradox/trace.ts';
test('ellsberg 不抛错', () => {
  let calls = 0;
  ellsbergAnalysis({ onChoice: () => calls++ });
  assert.ok(calls >= 4);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
