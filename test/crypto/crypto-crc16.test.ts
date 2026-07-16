import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crc16 } from '../../src/algorithms/crypto/crypto-crc16/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-crc16/trace.ts';
test('crc16 确定性', () => assert.equal(crc16([1, 2, 3]), crc16([1, 2, 3])));
test('crc16 0-65535', () => {
  const v = crc16([9, 9, 9]);
  assert.ok(v >= 0 && v <= 65535);
});
test('crc16 trace 非空', () => assert.ok(buildTrace().length > 0));
