import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adler32 } from '../../src/algorithms/hashing/hash-adler32/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-adler32/trace.ts';
test('Adler-32 标准值', () => {
  assert.equal(adler32('Wikipedia'), 0x11e60398);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
