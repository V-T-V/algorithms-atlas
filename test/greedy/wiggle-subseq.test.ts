import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wiggleSubseq } from '../../src/algorithms/greedy/wiggle-subseq/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/greedy/wiggle-subseq/trace.ts';

test('wiggleSubseq 已知长度', () => {
  assert.equal(wiggleSubseq([1, 7, 4, 9, 2, 5]).length, 6);
  assert.equal(wiggleSubseq([1, 17, 5, 10, 13, 15, 10, 5, 16, 8]).length, 7);
  assert.equal(wiggleSubseq([1, 2, 3, 4, 5, 6, 7, 8, 9]).length, 2);
});

test('wiggleSubseq 单元素', () => {
  assert.equal(wiggleSubseq([42]).length, 1);
});

test('wiggleSubseq 空数组', () => {
  assert.equal(wiggleSubseq([]).length, 0);
});

test('buildTrace 含长度', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
