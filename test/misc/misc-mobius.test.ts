import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mobius } from '../../src/algorithms/misc/misc-mobius/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-mobius/trace.ts';
test('μ(12)=0 (含平方)', () => {
  assert.equal(mobius(12), 0);
});
test('μ(30)=-1', () => {
  assert.equal(mobius(30), -1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
