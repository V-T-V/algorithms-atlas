import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priorityPreemptive } from '../../src/algorithms/scheduling/sched-priority-preempt-2/impl.ts';

test('priorityPreemptive 基本', () => {
  const r = priorityPreemptive([
    { pid: 'P1', arrival: 0, burst: 4, priority: 2 },
    { pid: 'P2', arrival: 1, burst: 3, priority: 1 },
    { pid: 'P3', arrival: 2, burst: 1, priority: 3 },
  ]);
  // P1 t=0 跑 1；P2 t=1 到达优先级 1 更高抢占；P2 跑 1-4 完成；
  // 然后 P1(2) < P3(3)，P1 跑 4-7 完成；P3 跑 7-8 完成
  assert.equal(r.completion.P2, 4);
  assert.equal(r.completion.P1, 7);
  assert.equal(r.completion.P3, 8);
});

test('priorityPreemptive 无抢占（先到优先级最高）', () => {
  const r = priorityPreemptive([
    { pid: 'A', arrival: 0, burst: 5, priority: 1 },
    { pid: 'B', arrival: 1, burst: 2, priority: 2 },
  ]);
  // A 优先级最高一直跑到完成
  assert.equal(r.completion.A, 5);
  assert.equal(r.completion.B, 7);
});

test('priorityPreemptive 相同优先级 FCFS', () => {
  const r = priorityPreemptive([
    { pid: 'X', arrival: 0, burst: 2, priority: 1 },
    { pid: 'Y', arrival: 0, burst: 2, priority: 1 },
  ]);
  // 相同优先级，按数组顺序先 X 后 Y
  assert.equal(r.completion.X, 2);
  assert.equal(r.completion.Y, 4);
});

test('priorityPreemptive 钩子', () => {
  let dispatches = 0;
  priorityPreemptive([{ pid: 'A', arrival: 0, burst: 2, priority: 1 }], {
    onDispatch: () => dispatches++,
  });
  assert.ok(dispatches >= 1);
});

test('priorityPreemptive 时间线总长 = 总 burst', () => {
  const procs = [
    { pid: 'A', arrival: 0, burst: 3, priority: 1 },
    { pid: 'B', arrival: 0, burst: 2, priority: 2 },
  ];
  const r = priorityPreemptive(procs);
  const total = r.timeline.reduce((s, seg) => s + (seg.end - seg.start), 0);
  assert.equal(total, 5);
});
