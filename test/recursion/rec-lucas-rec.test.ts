import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recLucasRec } from '../../src/algorithms/recursion/rec-lucas-rec/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-lucas-rec/trace.ts';

test('rec-lucas-rec 基本正确性', () => {
  const r = recLucasRec(8);
  assert.equal(r.result, 47);
});

test('rec-lucas-rec 调用次数 > 0', () => {
  const r = recLucasRec(8);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
