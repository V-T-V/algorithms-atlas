import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brotliEncode } from '../../src/algorithms/compression/comp-brotli-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-brotli-2/trace.ts';

test('brotli 匹配字典词', () => {
  const t = brotliEncode('www.html.body.div');
  assert.ok(t.some((x) => x.kind === 'dict'));
});
test('brotli trace 非空', () => assert.ok(buildTrace().length > 0));
