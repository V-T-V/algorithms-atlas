import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shortestElapsed } from '../../src/algorithms/scheduling/sched-shortest-elapsed/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-shortest-elapsed/trace.ts';

test('sched-shortest-elapsed 相同 burst 轮流运行', () => {
  const jobs = [
    { id: 'A', arrival: 0, burst: 4 },
    { id: 'B', arrival: 0, burst: 4 },
  ];
  const res = shortestElapsed(jobs, 2);
  // A,B,A,B 交替
  assert.equal(res.segments[0]!.id, 'A');
  assert.equal(res.segments[1]!.id, 'B');
  assert.equal(res.segments[2]!.id, 'A');
  assert.equal(res.segments[3]!.id, 'B');
});

test('sched-shortest-elapsed 已运行少的优先', () => {
  const jobs = [
    { id: 'A', arrival: 0, burst: 6 },
    { id: 'B', arrival: 0, burst: 2 },
  ];
  const res = shortestElapsed(jobs, 2);
  // 第一片 A；第二片 B（elapsed 0 < 2）；B 完成；之后 A 继续
  assert.equal(res.segments[0]!.id, 'A');
  assert.equal(res.segments[1]!.id, 'B');
});

test('sched-shortest-elapsed trace', () => {
  assert.ok(buildTrace().length > 2);
});
