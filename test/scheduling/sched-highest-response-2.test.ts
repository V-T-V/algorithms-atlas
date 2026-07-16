import { test } from 'node:test';
import assert from 'node:assert/strict';
import { preemptiveHrrn } from '../../src/algorithms/scheduling/sched-highest-response-2/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-highest-response-2/trace.ts';

test('sched-highest-response-2 无抢占时退化为非抢占', () => {
  const jobs = [
    { id: 'A', arrival: 0, burst: 3 },
    { id: 'B', arrival: 4, burst: 2 },
  ];
  const res = preemptiveHrrn(jobs);
  assert.equal(res.stats.find((s) => s.id === 'A')!.finish, 3);
  assert.equal(res.stats.find((s) => s.id === 'B')!.finish, 6);
});

test('sched-highest-response-2 短进程到达可抢占', () => {
  const jobs = [
    { id: 'LONG', arrival: 0, burst: 10 },
    { id: 'SHORT', arrival: 1, burst: 1 },
  ];
  const res = preemptiveHrrn(jobs);
  // SHORT 在 t=1 到达，R 高，应优先完成
  const shortFinish = res.stats.find((s) => s.id === 'SHORT')!.finish;
  const longFinish = res.stats.find((s) => s.id === 'LONG')!.finish;
  assert.ok(shortFinish < longFinish);
  assert.equal(shortFinish, 2);
});

test('sched-highest-response-2 所有进程完成', () => {
  const jobs = [
    { id: 'A', arrival: 0, burst: 4 },
    { id: 'B', arrival: 1, burst: 3 },
    { id: 'C', arrival: 2, burst: 2 },
  ];
  const res = preemptiveHrrn(jobs);
  for (const s of res.stats) assert.ok(s.finish > 0);
});

test('sched-highest-response-2 trace', () => {
  assert.ok(buildTrace().length > 2);
});
