import { test } from 'node:test';
import assert from 'node:assert/strict';
import { amicablePairs } from '../../src/algorithms/misc/misc-amicable-pair/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-amicable-pair/trace.ts';
test('220 和 284 是亲和数', () => {
  const pairs = amicablePairs(300);
  assert.ok(pairs.some((p) => p[0] === 220 && p[1] === 284));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
