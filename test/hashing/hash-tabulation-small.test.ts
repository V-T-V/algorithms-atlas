import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tabulationHash } from '../../src/algorithms/hashing/hash-tabulation-small/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-tabulation-small/trace.ts';
test('Tabulation 确定性', () => {
  assert.equal(tabulationHash('abc'), tabulationHash('abc'));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
