import { test } from 'node:test';
import assert from 'node:assert/strict';
import { multilevelQueue } from '../../src/algorithms/scheduling/multilevel-queue/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/scheduling/multilevel-queue/trace.ts';

const QUEUES = [
  { priority: 0, algorithm: 'rr' as const, quantum: 2 },
  { priority: 1, algorithm: 'fcfs' as const, quantum: 0 },
];

test('mlq 高优先级队列先执行完，低优先级才执行', () => {
  const r = multilevelQueue(
    [
      { id: 'A', arrival: 0, burst: 5, queue: 0 },
      { id: 'B', arrival: 0, burst: 3, queue: 0 },
      { id: 'C', arrival: 0, burst: 4, queue: 1 },
    ],
    QUEUES,
  );
  // Q0 的 A、B 在 Q1 的 C 之前完成
  const finishA = r.stats.find((s) => s.id === 'A')!.finish;
  const finishB = r.stats.find((s) => s.id === 'B')!.finish;
  const finishC = r.stats.find((s) => s.id === 'C')!.finish;
  assert.ok(finishA < finishC);
  assert.ok(finishB < finishC);
});

test('mlq 队列内 RR 交替', () => {
  const r = multilevelQueue(
    [
      { id: 'A', arrival: 0, burst: 4, queue: 0 },
      { id: 'B', arrival: 0, burst: 4, queue: 0 },
    ],
    [{ priority: 0, algorithm: 'rr', quantum: 2 }],
  );
  // RR q=2：A,B,A,B
  assert.deepEqual(
    r.segments.map((s) => s.id),
    ['A', 'B', 'A', 'B'],
  );
});

test('mlq 队列内 FCFS 不抢占', () => {
  const r = multilevelQueue(
    [
      { id: 'A', arrival: 0, burst: 5, queue: 0 },
      { id: 'B', arrival: 0, burst: 3, queue: 0 },
    ],
    [{ priority: 0, algorithm: 'fcfs', quantum: 0 }],
  );
  // FCFS：A 完全跑完再 B
  assert.deepEqual(
    r.segments.map((s) => s.id),
    ['A', 'B'],
  );
});

test('mlq 完成时刻统计正确', () => {
  const r = multilevelQueue(
    [
      { id: 'A', arrival: 0, burst: 2, queue: 0 },
      { id: 'B', arrival: 0, burst: 3, queue: 1 },
    ],
    QUEUES,
  );
  // A 先跑完（t=2），B 再跑（t=2→5）
  assert.equal(r.stats.find((s) => s.id === 'A')!.finish, 2);
  assert.equal(r.stats.find((s) => s.id === 'B')!.finish, 5);
});

test('mlq 等待与周转', () => {
  const r = multilevelQueue(
    [
      { id: 'A', arrival: 0, burst: 2, queue: 0 },
      { id: 'B', arrival: 0, burst: 3, queue: 1 },
    ],
    QUEUES,
  );
  const b = r.stats.find((s) => s.id === 'B')!;
  assert.equal(b.waiting, 2); // finish 5 - arrival 0 - burst 3
  assert.equal(b.turnaround, 5);
});

test('mlq 空输入', () => {
  const r = multilevelQueue([], QUEUES);
  assert.deepEqual(r.segments, []);
});

test('mlq 优先级相同的队列按下标顺序', () => {
  const r = multilevelQueue(
    [
      { id: 'A', arrival: 0, burst: 1, queue: 1 },
      { id: 'B', arrival: 0, burst: 1, queue: 0 },
    ],
    [
      { priority: 0, algorithm: 'fcfs', quantum: 0 },
      { priority: 0, algorithm: 'fcfs', quantum: 0 },
    ],
  );
  // 两队列同优先级 → 先 Q0(B) 再 Q1(A)
  assert.deepEqual(
    r.segments.map((s) => s.id),
    ['B', 'A'],
  );
});

test('mlq 钩子触发', () => {
  let dispatches = 0;
  let completes = 0;
  multilevelQueue(
    [
      { id: 'A', arrival: 0, burst: 2, queue: 0 },
      { id: 'B', arrival: 0, burst: 2, queue: 0 },
    ],
    [{ priority: 0, algorithm: 'rr', quantum: 1 }],
    {
      onDispatch: () => dispatches++,
      onComplete: () => completes++,
    },
  );
  // q=1, burst=2 → 每进程 2 段
  assert.equal(dispatches, 4);
  assert.equal(completes, 2);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
