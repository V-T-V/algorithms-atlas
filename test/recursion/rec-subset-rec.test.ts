import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recSubsetRec } from '../../src/algorithms/recursion/rec-subset-rec/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-subset-rec/trace.ts';

test('rec-subset-rec 基本正确性', () => {
  const r = recSubsetRec(5, 2);
  assert.equal(r.result, 10);
});

test('rec-subset-rec 调用次数 > 0', () => {
  const r = recSubsetRec(5, 2);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
