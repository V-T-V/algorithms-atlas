import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brotliContextModel } from '../../src/algorithms/compression/comp-brotli-context/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-brotli-context/trace.ts';
test('brotli ctx 计数正确', () => {
  const t = brotliContextModel([1, 2, 1]);
  assert.ok(t.size >= 2);
});
test('brotli ctx trace 非空', () => assert.ok(buildTrace().length >= 2));
