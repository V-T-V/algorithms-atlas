import { test } from 'node:test';
import assert from 'node:assert/strict';
import { multilevelFeedbackQueue } from '../../src/algorithms/scheduling/sched-feedback-queue/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-feedback-queue/trace.ts';

test('sched-feedback-queue 长进程被降级', () => {
  const jobs = [{ id: 'LONG', arrival: 0, burst: 10 }];
  const res = multilevelFeedbackQueue(jobs, 3, 2, 100);
  // 应在不同层级运行
  const distinctLevels = new Set(res.segments.map((s) => s.level));
  assert.ok(distinctLevels.size > 1);
  assert.equal(res.stats[0]!.finalLevel, 2);
});

test('sched-feedback-queue 短进程在高层完成', () => {
  const jobs = [{ id: 'SHORT', arrival: 0, burst: 2 }];
  const res = multilevelFeedbackQueue(jobs, 3, 2, 100);
  assert.equal(res.stats[0]!.finalLevel, 0);
  assert.equal(res.stats[0]!.finish, 2);
});

test('sched-feedback-queue 所有进程都能完成', () => {
  const jobs = [
    { id: 'A', arrival: 0, burst: 5 },
    { id: 'B', arrival: 0, burst: 5 },
    { id: 'C', arrival: 0, burst: 5 },
  ];
  const res = multilevelFeedbackQueue(jobs, 3, 2, 100);
  for (const s of res.stats) assert.ok(s.finish > 0);
});

test('sched-feedback-queue trace', () => {
  assert.ok(buildTrace().length > 2);
});
