import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recPermutationRec } from '../../src/algorithms/recursion/rec-permutation-rec/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-permutation-rec/trace.ts';

test('rec-permutation-rec 基本正确性', () => {
  const r = recPermutationRec(6, 3);
  assert.equal(r.result, 120);
});

test('rec-permutation-rec 调用次数 > 0', () => {
  const r = recPermutationRec(6, 3);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
