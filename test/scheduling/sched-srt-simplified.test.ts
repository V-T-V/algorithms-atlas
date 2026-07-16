import { test } from 'node:test';
import assert from 'node:assert/strict';
import { srtSimplified } from '../../src/algorithms/scheduling/sched-srt-simplified/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-srt-simplified/trace.ts';
test('srtSimplified 正确', () => {
  const r = srtSimplified([
    { id: 'A', arrival: 0, burst: 6 },
    { id: 'B', arrival: 1, burst: 3 },
    { id: 'C', arrival: 2, burst: 1 },
  ]);
  assert.equal(r.order[0], 'A');
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
