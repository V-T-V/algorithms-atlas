import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ctwPredict } from '../../src/algorithms/compression/comp-ctw/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-ctw/trace.ts';

test('ctw 概率在 [0,1]', () => {
  for (const p of ctwPredict([0, 1, 0, 1, 0, 1])) assert.ok(p >= 0 && p <= 1);
});
test('ctw 长度匹配', () => {
  assert.equal(ctwPredict([1, 0, 1, 0]).length, 4);
});
test('ctw trace 非空', () => assert.ok(buildTrace().length > 0));
