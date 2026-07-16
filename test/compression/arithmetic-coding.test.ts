import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  arithmeticEncode,
  arithmeticDecode,
  buildCDF,
  type FreqMap,
} from '../../src/algorithms/compression/arithmetic-coding/impl.ts';

const FREQ: FreqMap = { A: 3, B: 2, C: 1 };

test('算术编码编解码一致', () => {
  const msg = 'ABC';
  const enc = arithmeticEncode(msg, FREQ);
  const dec = arithmeticDecode(enc.code, enc.length, FREQ);
  assert.equal(dec, msg);
});

test('算术编码编解码一致（更长消息）', () => {
  const msg = 'ABACABA';
  const enc = arithmeticEncode(msg, FREQ);
  const dec = arithmeticDecode(enc.code, enc.length, FREQ);
  assert.equal(dec, msg);
});

test('buildCDF 累积分布正确', () => {
  const cdf = buildCDF({ A: 1, B: 1 });
  assert.ok(Math.abs(cdf[0]!.lo - 0) < 1e-9);
  assert.ok(Math.abs(cdf[0]!.hi - 0.5) < 1e-9);
  assert.ok(Math.abs(cdf[1]!.lo - 0.5) < 1e-9);
  assert.ok(Math.abs(cdf[1]!.hi - 1) < 1e-9);
});

test('编码值在 [0,1) 内', () => {
  const enc = arithmeticEncode('ABC', FREQ);
  assert.ok(enc.code >= 0 && enc.code < 1);
});

test('钩子被调用', () => {
  let calls = 0;
  arithmeticEncode('ABC', FREQ, { onEncodeSymbol: () => calls++ });
  assert.equal(calls, 3);
});

test('未知字符抛错', () => {
  assert.throws(() => arithmeticEncode('XYZ', FREQ));
});
