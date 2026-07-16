import { test } from 'node:test';
import assert from 'node:assert/strict';
import { serpentEncrypt } from '../../src/algorithms/crypto/crypto-serpent/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-serpent/trace.ts';

test('serpent 输出 2 字节', () => {
  const ct = serpentEncrypt([0xab, 0xcd], [0x12, 0x34]);
  assert.equal(ct.length, 2);
});
test('serpent 确定性', () => {
  assert.deepEqual(serpentEncrypt([1, 2], [3, 4]), serpentEncrypt([1, 2], [3, 4]));
});
test('serpent trace 非空', () => assert.ok(buildTrace().length > 0));
