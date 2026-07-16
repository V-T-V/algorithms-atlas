import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priorityScheduling } from '../../src/algorithms/scheduling/priority-scheduling/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/scheduling/priority-scheduling/trace.ts';

const JOBS = [
  { id: 'P1', arrival: 0, burst: 4, priority: 2 },
  { id: 'P2', arrival: 1, burst: 3, priority: 1 },
  { id: 'P3', arrival: 2, burst: 1, priority: 4 },
  { id: 'P4', arrival: 3, burst: 2, priority: 3 },
];

test('priority-scheduling 非抢占：执行顺序', () => {
  const r = priorityScheduling(JOBS, { preemptive: false });
  // P1 先跑（t=0 唯一到达），完成后 t=4 选最高优先级 P2(p1)→P4(p3)→P3(p4)
  assert.deepEqual(
    r.segments.map((s) => s.id),
    ['P1', 'P2', 'P4', 'P3'],
  );
});

test('priority-scheduling 非抢占：时间段正确', () => {
  const r = priorityScheduling(JOBS, { preemptive: false });
  assert.equal(r.segments[0]!.start, 0);
  assert.equal(r.segments[0]!.finish, 4);
  assert.equal(r.segments[1]!.start, 4);
  assert.equal(r.segments[1]!.finish, 7);
  assert.equal(r.segments[3]!.finish, 10);
});

test('priority-scheduling 非抢占：等待与周转', () => {
  const r = priorityScheduling(JOBS, { preemptive: false });
  const p2 = r.stats.find((s) => s.id === 'P2')!;
  assert.equal(p2.waiting, 4 - 1); // start(4) - arrival(1)
  assert.equal(p2.turnaround, 7 - 1);
  const p3 = r.stats.find((s) => s.id === 'P3')!;
  assert.equal(p3.finish, 10);
  assert.equal(p3.waiting, 10 - 2 - 1); // finish - arrival - burst
});

test('priority-scheduling 非抢占：平均等待时间', () => {
  const r = priorityScheduling(JOBS, { preemptive: false });
  // 等待：P1=0, P2=3, P3=7, P4=4 → 平均 3.5
  assert.equal(r.avgWaiting, 3.5);
  assert.equal(r.avgTurnaround, 6);
});

test('priority-scheduling 抢占：P1 被 P2 抢占', () => {
  const r = priorityScheduling(JOBS, { preemptive: true });
  // P1 跑 0-1，P2(t=1,p1)抢占 → P2 跑 1-4，P1 恢复 4-7
  assert.equal(r.segments[0]!.id, 'P1');
  assert.equal(r.segments[0]!.start, 0);
  assert.equal(r.segments[0]!.finish, 1);
  assert.equal(r.segments[1]!.id, 'P2');
  assert.equal(r.segments[1]!.start, 1);
  assert.equal(r.segments[1]!.finish, 4);
  assert.equal(r.segments[2]!.id, 'P1');
  assert.equal(r.segments[2]!.start, 4);
  assert.equal(r.segments[2]!.finish, 7);
});

test('priority-scheduling 抢占：P1 跨两段', () => {
  const r = priorityScheduling(JOBS, { preemptive: true });
  const p1Segs = r.segments.filter((s) => s.id === 'P1');
  assert.equal(p1Segs.length, 2);
  // 总运行时间 = burst = 4
  const total = p1Segs.reduce((sum, s) => sum + (s.finish - s.start), 0);
  assert.equal(total, 4);
});

test('priority-scheduling 全部同时到达选最高优先级', () => {
  const r = priorityScheduling(
    [
      { id: 'A', arrival: 0, burst: 3, priority: 3 },
      { id: 'B', arrival: 0, burst: 2, priority: 1 },
      { id: 'C', arrival: 0, burst: 1, priority: 2 },
    ],
    { preemptive: false },
  );
  // 优先级 B(p1) > C(p2) > A(p3)
  assert.deepEqual(
    r.segments.map((s) => s.id),
    ['B', 'C', 'A'],
  );
});

test('priority-scheduling 空输入', () => {
  const r = priorityScheduling([]);
  assert.deepEqual(r.segments, []);
  assert.equal(r.avgWaiting, 0);
});

test('priority-scheduling 钩子被调用', () => {
  let picks = 0;
  let completes = 0;
  let schedules = 0;
  priorityScheduling(
    JOBS,
    { preemptive: false },
    {
      onPick: () => picks++,
      onComplete: () => completes++,
      onSchedule: () => schedules++,
    },
  );
  assert.equal(picks, JOBS.length);
  assert.equal(completes, JOBS.length);
  assert.equal(schedules, JOBS.length); // 非抢占每进程一段
});

test('priority-scheduling 抢占模式下 onPreempt 被调用', () => {
  let preempts = 0;
  priorityScheduling(
    JOBS,
    { preemptive: true },
    {
      onPreempt: () => preempts++,
    },
  );
  assert.ok(preempts >= 1, '应至少发生一次抢占');
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 4);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '终帧应有 bars');
  const order = last.aux!.find((e) => e.label === '执行顺序');
  assert.ok(order);
  assert.ok(order!.value.includes('P1'));
});

test('buildTrace 平均等待时间正确', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  const last = frames[frames.length - 1]!;
  const wait = last.aux!.find((e) => e.label === '平均等待')!;
  assert.equal(wait.value, '3.50');
});

test('buildTrace 抢占模式', () => {
  const frames = buildTrace({ jobs: DEFAULT_INPUT, preemptive: true });
  assert.ok(frames.length >= 4);
  // 第一帧模式标注应含「抢占」
  const first = frames[0]!;
  const mode = first.aux!.find((e) => e.label === '模式')!;
  assert.ok(mode.value.includes('抢占'));
});
