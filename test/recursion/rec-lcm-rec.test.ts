import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recLcmRec } from '../../src/algorithms/recursion/rec-lcm-rec/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-lcm-rec/trace.ts';

test('rec-lcm-rec 基本正确性', () => {
  const r = recLcmRec(12, 18);
  assert.equal(r.result, 36);
});

test('rec-lcm-rec 调用次数 > 0', () => {
  const r = recLcmRec(12, 18);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
