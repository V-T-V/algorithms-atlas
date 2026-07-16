import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selfishRoundRobin } from '../../src/algorithms/scheduling/sched-selfish-round-robin/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-selfish-round-robin/trace.ts';

test('sched-selfish-round-robin capacity=1 等同 FCFS', () => {
  const jobs = [
    { id: 'A', arrival: 0, burst: 2 },
    { id: 'B', arrival: 0, burst: 2 },
  ];
  const res = selfishRoundRobin(jobs, 1, 1);
  // A 必须先完成，B 才被接纳
  assert.equal(res.stats.find((s) => s.id === 'A')!.finish, 2);
  assert.equal(res.stats.find((s) => s.id === 'B')!.finish, 4);
});

test('sched-selfish-round-robin 新进程在容量未满时被接纳', () => {
  const jobs = [
    { id: 'A', arrival: 0, burst: 4 },
    { id: 'B', arrival: 0, burst: 4 },
    { id: 'C', arrival: 0, burst: 4 },
  ];
  const res = selfishRoundRobin(jobs, 2, 2);
  // C 需等 A 或 B 完成后才进池
  assert.ok(res.stats.find((s) => s.id === 'C')!.waiting > 0);
});

test('sched-selfish-round-robin trace', () => {
  assert.ok(buildTrace().length > 2);
});
