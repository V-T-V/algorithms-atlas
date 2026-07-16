import { test } from 'node:test';
import assert from 'node:assert/strict';
import { snappyEncode } from '../../src/algorithms/compression/comp-snappy-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-snappy-2/trace.ts';

test('snappy 长输入含 copy', () => {
  const t = snappyEncode('ABCDEFGHIJKLMNOPABCDEFGHIJKLMNOP');
  assert.ok(t.some((x) => x.kind === 'copy'));
});
test('snappy 短输入全 literal', () => {
  const t = snappyEncode('AB');
  assert.ok(t.every((x) => x.kind === 'literal'));
});
test('snappy trace 非空', () => assert.ok(buildTrace().length > 0));
