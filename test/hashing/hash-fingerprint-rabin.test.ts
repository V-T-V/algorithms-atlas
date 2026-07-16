import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rabinFingerprint } from '../../src/algorithms/hashing/hash-fingerprint-rabin/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-fingerprint-rabin/trace.ts';
test('Rabin 指纹确定性', () => {
  assert.equal(rabinFingerprint('abc'), rabinFingerprint('abc'));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
