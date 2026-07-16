import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simHash, hamming32 } from '../../src/algorithms/hashing/hash-simhash-doc/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-simhash-doc/trace.ts';
test('相同文档指纹相同', () => {
  const f1 = simHash([['a', 1]]);
  const f2 = simHash([['a', 1]]);
  assert.equal(hamming32(f1, f2), 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
