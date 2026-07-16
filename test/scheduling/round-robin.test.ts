import { test } from 'node:test';
import assert from 'node:assert/strict';
import { roundRobin } from '../../src/algorithms/scheduling/round-robin/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/scheduling/round-robin/trace.ts';

const JOBS = [
  { id: 'P1', arrival: 0, burst: 5 },
  { id: 'P2', arrival: 0, burst: 3 },
  { id: 'P3', arrival: 0, burst: 1 },
  { id: 'P4', arrival: 0, burst: 4 },
];

test('round-robin 执行顺序（quantum=2）', () => {
  const r = roundRobin(JOBS, { quantum: 2 });
  // P1,P2,P3(完),P4,P1,P2(完),P4(完),P1(完)
  assert.deepEqual(
    r.segments.map((s) => s.id),
    ['P1', 'P2', 'P3', 'P4', 'P1', 'P2', 'P4', 'P1'],
  );
});

test('round-robin 时间段正确', () => {
  const r = roundRobin(JOBS, { quantum: 2 });
  assert.equal(r.segments[0]!.start, 0);
  assert.equal(r.segments[0]!.finish, 2);
  assert.equal(r.segments[2]!.start, 4);
  assert.equal(r.segments[2]!.finish, 5); // P3 burst=1 < quantum=2
  assert.equal(r.segments[7]!.finish, 13); // 最后 P1 完成
});

test('round-robin 完成时刻', () => {
  const r = roundRobin(JOBS, { quantum: 2 });
  const finishOf = (id: string) => r.stats.find((s) => s.id === id)!.finish;
  assert.equal(finishOf('P3'), 5); // 最早完成
  assert.equal(finishOf('P2'), 10);
  assert.equal(finishOf('P4'), 12);
  assert.equal(finishOf('P1'), 13); // 最后完成
});

test('round-robin 等待与周转时间', () => {
  const r = roundRobin(JOBS, { quantum: 2 });
  const p1 = r.stats.find((s) => s.id === 'P1')!;
  assert.equal(p1.waiting, 13 - 5); // finish - arrival - burst
  assert.equal(p1.turnaround, 13);
  const p3 = r.stats.find((s) => s.id === 'P3')!;
  assert.equal(p3.waiting, 5 - 1);
});

test('round-robin 平均等待时间', () => {
  const r = roundRobin(JOBS, { quantum: 2 });
  // 等待：P1=8, P2=7, P3=4, P4=8 → 27/4 = 6.75
  assert.equal(r.avgWaiting, 6.75);
});

test('round-robin quantum 大于最大 burst 时退化为 FCFS', () => {
  const r = roundRobin(JOBS, { quantum: 100 });
  // 每个进程一轮跑完，顺序 = 到达顺序
  assert.deepEqual(
    r.segments.map((s) => s.id),
    ['P1', 'P2', 'P3', 'P4'],
  );
});

test('round-robin quantum=1 严格轮转', () => {
  const r = roundRobin(JOBS, { quantum: 1 });
  // P1,P2,P3(完),P4,P1,P2,P4,P1,P2(完),P4,P1,P4(完),P1(完)
  assert.deepEqual(
    r.segments.map((s) => s.id),
    ['P1', 'P2', 'P3', 'P4', 'P1', 'P2', 'P4', 'P1', 'P2', 'P4', 'P1', 'P4', 'P1'],
  );
});

test('round-robin 不同到达时间', () => {
  const r = roundRobin(
    [
      { id: 'A', arrival: 0, burst: 3 },
      { id: 'B', arrival: 1, burst: 3 },
    ],
    { quantum: 2 },
  );
  // A 跑 0-2（剩1），此时 B 已到达，B 跑 2-4（剩1），A 跑 4-5（完），B 跑 5-6（完）
  assert.deepEqual(
    r.segments.map((s) => s.id),
    ['A', 'B', 'A', 'B'],
  );
  assert.equal(r.stats.find((s) => s.id === 'A')!.finish, 5);
  assert.equal(r.stats.find((s) => s.id === 'B')!.finish, 6);
});

test('round-robin 空输入', () => {
  const r = roundRobin([], { quantum: 2 });
  assert.deepEqual(r.segments, []);
  assert.equal(r.avgWaiting, 0);
});

test('round-robin 钩子被调用', () => {
  let dispatches = 0;
  let runs = 0;
  let completes = 0;
  let requeues = 0;
  roundRobin(
    JOBS,
    { quantum: 2 },
    {
      onDispatch: () => dispatches++,
      onRun: () => runs++,
      onComplete: () => completes++,
      onRequeue: () => requeues++,
    },
  );
  assert.equal(dispatches, 8); // 8 个时间段
  assert.equal(runs, 8);
  assert.equal(completes, JOBS.length);
  // requeue = 段数 - 完成数 = 8 - 4 = 4
  assert.equal(requeues, 4);
});

test('round-robin onDispatch 就绪队列正确', () => {
  const queues: string[][] = [];
  roundRobin(
    JOBS,
    { quantum: 2 },
    {
      onDispatch: (_job, _q, rq) => queues.push(rq.map((j) => j.id)),
    },
  );
  // 第一次 dispatch P1 时，队列为 [P2,P3,P4]
  assert.deepEqual(queues[0], ['P2', 'P3', 'P4']);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 5);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '终帧应有 bars');
  // 终帧所有进程剩余为 0
  for (const b of last.bars!) assert.equal(b.value, 0);
});

test('buildTrace 平均等待时间正确', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  const last = frames[frames.length - 1]!;
  const wait = last.aux!.find((e) => e.label === '平均等待')!;
  assert.equal(wait.value, '6.75');
});
