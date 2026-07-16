import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stirling2 } from '../../src/algorithms/misc/misc-stirling-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-stirling-2/trace.ts';
test('S(4,2)=7', () => {
  const dp = stirling2(4, 2);
  assert.equal(dp[4]![2], 7);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
