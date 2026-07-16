import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recFibRec } from '../../src/algorithms/recursion/rec-fib-rec/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-fib-rec/trace.ts';

test('rec-fib-rec 基本正确性', () => {
  const r = recFibRec(10);
  assert.equal(r.result, 55);
});

test('rec-fib-rec 调用次数 > 0', () => {
  const r = recFibRec(10);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
