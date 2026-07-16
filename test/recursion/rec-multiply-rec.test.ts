import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recMultiplyRec } from '../../src/algorithms/recursion/rec-multiply-rec/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-multiply-rec/trace.ts';

test('rec-multiply-rec 基本正确性', () => {
  const r = recMultiplyRec(6, 7);
  assert.equal(r.result, 42);
});

test('rec-multiply-rec 调用次数 > 0', () => {
  const r = recMultiplyRec(6, 7);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
