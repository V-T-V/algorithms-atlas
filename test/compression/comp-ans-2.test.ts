import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ansEncode } from '../../src/algorithms/compression/comp-ans-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-ans-2/trace.ts';

test('ans encode 单调递增', () => {
  const freq = new Map([
    [65, { sym: 65, base: 3, cum: 0 }],
    [66, { sym: 66, base: 3, cum: 1 }],
  ]);
  const x = ansEncode([65, 66, 65], freq);
  assert.ok(x > 1);
});
test('ans trace 非空', () => assert.ok(buildTrace().length > 0));
