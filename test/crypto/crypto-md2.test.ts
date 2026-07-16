import { test } from 'node:test';
import assert from 'node:assert/strict';
import { md2 } from '../../src/algorithms/crypto/crypto-md2/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-md2/trace.ts';

test('md2 输出 16 字节', () => {
  assert.equal(md2([1, 2, 3]).length, 16);
});
test('md2 雪崩效应', () => {
  const a = md2([1, 2, 3]);
  const b = md2([1, 2, 4]);
  let diff = 0;
  for (let i = 0; i < 16; i++) if (a[i] !== b[i]) diff++;
  assert.ok(diff > 0);
});
test('md2 确定性', () => {
  assert.deepEqual(md2([1, 2, 3]), md2([1, 2, 3]));
});
test('md2 trace 非空', () => assert.ok(buildTrace().length > 0));
