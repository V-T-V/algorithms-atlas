import { test } from 'node:test';
import assert from 'node:assert/strict';
import { goldbach } from '../../src/algorithms/misc/misc-goldbach/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-goldbach/trace.ts';
test('100 至少一对', () => {
  const pairs = goldbach(100);
  assert.ok(pairs.length > 0);
  assert.equal(pairs[0]![0] + pairs[0]![1], 100);
});
test('奇数返回空', () => {
  assert.equal(goldbach(9).length, 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
