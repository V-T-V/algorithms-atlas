import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lz2Encode, lz2Decode } from '../../src/algorithms/compression/comp-lz-2/impl.ts';

void lz2Decode;
import { buildTrace } from '../../src/algorithms/compression/comp-lz-2/trace.ts';

test('lz2 编码产生 token', () => {
  const t = lz2Encode('ABABABABABC', 8, 3);
  assert.ok(t.length > 0);
  assert.ok(t.some((x) => x.length >= 3));
});
test('lz2 单字符输出 distance=0', () => {
  const t = lz2Encode('A', 8, 3);
  assert.deepEqual(t, [{ distance: 0, length: 1 }]);
});
test('lz2 trace 非空', () => assert.ok(buildTrace().length > 0));
