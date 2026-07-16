import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isAbundant } from '../../src/algorithms/misc/misc-abundant-number/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-abundant-number/trace.ts';
test('12 是过剩数', () => {
  assert.equal(isAbundant(12), true);
});
test('11 非过剩数', () => {
  assert.equal(isAbundant(11), false);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
