import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rangeCoder, buildModel } from '../../src/algorithms/compression/range-coder/impl.ts';

test('range-coder：输出字节合法', () => {
  const model = buildModel([1, 1, 1]);
  const r = rangeCoder([0, 1, 2], model);
  assert.ok(r.bytes.length >= 5, '至少输出 5 个刷新字节');
  assert.ok(r.bytes.every((b) => b >= 0 && b <= 255));
});

test('range-coder：空符号仍产生刷新字节', () => {
  const model = buildModel([1, 1]);
  const r = rangeCoder([], model);
  assert.ok(r.bytes.length > 0);
});
