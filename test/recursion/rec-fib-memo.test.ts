import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recFibMemo } from '../../src/algorithms/recursion/rec-fib-memo/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-fib-memo/trace.ts';

test('rec-fib-memo 基本正确性', () => {
  const r = recFibMemo(20);
  assert.equal(r.result, 6765);
});

test('rec-fib-memo 调用次数 > 0', () => {
  const r = recFibMemo(20);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
