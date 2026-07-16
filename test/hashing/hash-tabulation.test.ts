import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tabulationHash } from '../../src/algorithms/hashing/hash-tabulation/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/hash-tabulation/trace.ts';

test('tabulation 确定性', () => {
  assert.equal(tabulationHash('hello'), tabulationHash('hello'));
});
test('tabulation 不同输入不同', () => {
  assert.notEqual(tabulationHash('hello'), tabulationHash('world'));
});
test('tabulation 空输入稳定', () => {
  assert.ok(tabulationHash('') >= 0n);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
