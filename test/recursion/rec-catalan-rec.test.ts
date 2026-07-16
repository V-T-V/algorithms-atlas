import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recCatalanRec } from '../../src/algorithms/recursion/rec-catalan-rec/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-catalan-rec/trace.ts';

test('rec-catalan-rec 基本正确性', () => {
  const r = recCatalanRec(6);
  assert.equal(r.result, 132);
});

test('rec-catalan-rec 调用次数 > 0', () => {
  const r = recCatalanRec(6);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
