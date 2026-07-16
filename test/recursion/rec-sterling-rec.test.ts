import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recSterlingRec } from '../../src/algorithms/recursion/rec-sterling-rec/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-sterling-rec/trace.ts';

test('rec-sterling-rec 基本正确性', () => {
  const r = recSterlingRec(5, 3);
  assert.equal(r.result, 25);
});

test('rec-sterling-rec 调用次数 > 0', () => {
  const r = recSterlingRec(5, 3);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
