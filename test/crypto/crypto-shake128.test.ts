import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shake128 } from '../../src/algorithms/crypto/crypto-shake128/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-shake128/trace.ts';

test('shake128 任意长度输出', () => {
  assert.equal(shake128([1, 2, 3], 16).length, 16);
  assert.equal(shake128([1, 2, 3], 64).length, 64);
});
test('shake128 确定性', () => {
  assert.deepEqual(shake128([1, 2, 3], 32), shake128([1, 2, 3], 32));
});
test('shake128 雪崩', () => {
  const a = shake128([1, 2, 3], 32);
  const b = shake128([1, 2, 4], 32);
  assert.ok(a.some((v, i) => v !== b[i]));
});
test('shake128 trace 非空', () => assert.ok(buildTrace().length > 0));
