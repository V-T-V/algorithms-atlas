import { test } from 'node:test';
import assert from 'node:assert/strict';
import { primeGaps } from '../../src/algorithms/misc/misc-prime-gap/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-prime-gap/trace.ts';
test('50 内有孪生素数', () => {
  const r = primeGaps(50);
  assert.ok(r.twinCount > 0);
  assert.ok(r.maxGap >= 2);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
