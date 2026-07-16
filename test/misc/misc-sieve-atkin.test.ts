import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sieveAtkin } from '../../src/algorithms/misc/misc-sieve-atkin/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-sieve-atkin/trace.ts';
test('Atkin 30 内素数', () => {
  assert.deepEqual(sieveAtkin(30), [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
