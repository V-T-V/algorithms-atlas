import { test } from 'node:test';
import assert from 'node:assert/strict';
import { riceBlockEncode } from '../../src/algorithms/compression/comp-rice-block/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-rice-block/trace.ts';
test('rice-block 总位数为正', () => {
  const r = riceBlockEncode([0, 1, 2], 2, 4);
  assert.ok(r.bits > 0);
});
test('rice-block trace 非空', () => assert.ok(buildTrace().length >= 2));
