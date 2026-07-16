import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recGcdRec2 } from '../../src/algorithms/recursion/rec-gcd-rec-2/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-gcd-rec-2/trace.ts';

test('rec-gcd-rec-2 基本正确性', () => {
  const r = recGcdRec2(48, 36);
  assert.equal(r.result, 12);
});

test('rec-gcd-rec-2 调用次数 > 0', () => {
  const r = recGcdRec2(48, 36);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
