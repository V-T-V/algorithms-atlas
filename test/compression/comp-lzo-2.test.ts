import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lzoEncode } from '../../src/algorithms/compression/comp-lzo-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-lzo-2/trace.ts';

test('lzo 检测 run', () => {
  const t = lzoEncode('AAAAAAAABC');
  assert.ok(t.some((x) => x.kind === 'run' && x.len >= 6));
});
test('lzo trace 非空', () => assert.ok(buildTrace().length > 0));
