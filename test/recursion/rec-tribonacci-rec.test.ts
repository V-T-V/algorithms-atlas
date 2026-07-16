import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recTribonacciRec } from '../../src/algorithms/recursion/rec-tribonacci-rec/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-tribonacci-rec/trace.ts';

test('rec-tribonacci-rec 基本正确性', () => {
  const r = recTribonacciRec(8);
  assert.equal(r.result, 13);
});

test('rec-tribonacci-rec 调用次数 > 0', () => {
  const r = recTribonacciRec(8);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
