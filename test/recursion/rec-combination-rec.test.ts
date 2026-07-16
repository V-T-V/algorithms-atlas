import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recCombinationRec } from '../../src/algorithms/recursion/rec-combination-rec/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-combination-rec/trace.ts';

test('rec-combination-rec C(6,3) = 20', () => {
  const r = recCombinationRec(6, 3);
  assert.equal(r.result, 20);
});

test('rec-combination-rec C(n,0) = 1', () => {
  const r = recCombinationRec(10, 0);
  assert.equal(r.result, 1);
});

test('rec-combination-rec C(n,n) = 1', () => {
  const r = recCombinationRec(5, 5);
  assert.equal(r.result, 1);
});

test('rec-combination-rec C(n,k) = 0 if k>n', () => {
  const r = recCombinationRec(3, 5);
  assert.equal(r.result, 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
