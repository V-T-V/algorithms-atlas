import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recPellRec } from '../../src/algorithms/recursion/rec-pell-rec/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-pell-rec/trace.ts';

test('rec-pell-rec 基本正确性', () => {
  const r = recPellRec(7);
  assert.equal(r.result, 169);
});

test('rec-pell-rec 调用次数 > 0', () => {
  const r = recPellRec(7);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
