import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adaptiveFeedback } from '../../src/algorithms/scheduling/sched-multi-level-feedback-2/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-multi-level-feedback-2/trace.ts';

test('sched-multi-level-feedback-2 CPU 密集进程 quantum 增大', () => {
  const jobs = [{ id: 'CPU', arrival: 0, burst: 10 }];
  const res = adaptiveFeedback(jobs, 2);
  // 始终用满 quantum，ema→1，quantum 应增大
  assert.ok(res.stats[0]!.finalQuantum > 2);
});

test('sched-multi-level-feedback-2 单进程能完成', () => {
  const jobs = [{ id: 'A', arrival: 0, burst: 5 }];
  const res = adaptiveFeedback(jobs, 2);
  assert.equal(res.stats[0]!.finish, 5);
});

test('sched-multi-level-feedback-2 多进程都完成', () => {
  const jobs = [
    { id: 'A', arrival: 0, burst: 4 },
    { id: 'B', arrival: 0, burst: 4 },
    { id: 'C', arrival: 0, burst: 4 },
  ];
  const res = adaptiveFeedback(jobs, 2);
  for (const s of res.stats) assert.ok(s.finish > 0);
});

test('sched-multi-level-feedback-2 trace', () => {
  assert.ok(buildTrace().length > 2);
});
