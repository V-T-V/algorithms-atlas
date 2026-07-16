import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recDigitsRec } from '../../src/algorithms/recursion/rec-digits-rec/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-digits-rec/trace.ts';

test('rec-digits-rec 基本正确性', () => {
  const r = recDigitsRec(12345);
  assert.equal(r.result, 15);
});

test('rec-digits-rec 调用次数 > 0', () => {
  const r = recDigitsRec(12345);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
