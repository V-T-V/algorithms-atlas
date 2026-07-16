import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recCompositionRec } from '../../src/algorithms/recursion/rec-composition-rec/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-composition-rec/trace.ts';

test('rec-composition-rec comp(6,3) = 10', () => {
  // comp(6,3) = C(5,2) = 10
  const r = recCompositionRec(6, 3);
  assert.equal(r.result, 10);
});

test('rec-composition-rec comp(5,1) = 1', () => {
  const r = recCompositionRec(5, 1);
  assert.equal(r.result, 1);
});

test('rec-composition-rec comp(4,5) = 0 (k>n)', () => {
  const r = recCompositionRec(4, 5);
  assert.equal(r.result, 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
