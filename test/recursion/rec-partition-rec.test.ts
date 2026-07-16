import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recPartitionRec } from '../../src/algorithms/recursion/rec-partition-rec/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-partition-rec/trace.ts';

test('rec-partition-rec 基本正确性', () => {
  const r = recPartitionRec(6, 3);
  assert.equal(r.result, 3);
});

test('rec-partition-rec 调用次数 > 0', () => {
  const r = recPartitionRec(6, 3);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
