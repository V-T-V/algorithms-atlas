import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nimStrategy } from '../../src/algorithms/misc/misc-nim-strategy/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-nim-strategy/trace.ts';
test('相同堆 Nim 和 0 必败', () => {
  assert.equal(nimStrategy([5, 5]).firstWins, false);
});
test('[1,2,3] Nim 和 0', () => {
  assert.equal(nimStrategy([1, 2, 3]).firstWins, false);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
