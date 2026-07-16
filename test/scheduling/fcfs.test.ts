import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fcfs } from '../../src/algorithms/scheduling/fcfs/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/scheduling/fcfs/trace.ts';

// 经典例：所有进程 t=0 到达
const JOBS = [
  { id: 'P1', arrival: 0, burst: 24 },
  { id: 'P2', arrival: 0, burst: 3 },
  { id: 'P3', arrival: 0, burst: 3 },
];

test('fcfs 执行顺序 = 到达顺序', () => {
  const r = fcfs(JOBS);
  assert.deepEqual(
    r.stats.map((s) => s.id),
    ['P1', 'P2', 'P3'],
  );
  assert.deepEqual(
    r.segments.map((s) => s.id),
    ['P1', 'P2', 'P3'],
  );
});

test('fcfs 经典平均等待时间 = 17', () => {
  const r = fcfs(JOBS);
  // P1: wait 0, P2: wait 24, P3: wait 27 → 平均 (0+24+27)/3 = 17
  assert.equal(r.avgWait, 17);
});

test('fcfs 单个进程统计正确', () => {
  const r = fcfs(JOBS);
  const p1 = r.stats.find((s) => s.id === 'P1')!;
  assert.equal(p1.start, 0);
  assert.equal(p1.completion, 24);
  assert.equal(p1.wait, 0);
  assert.equal(p1.turnaround, 24);
  const p2 = r.stats.find((s) => s.id === 'P2')!;
  assert.equal(p2.start, 24);
  assert.equal(p2.completion, 27);
  assert.equal(p2.wait, 24);
  const p3 = r.stats.find((s) => s.id === 'P3')!;
  assert.equal(p3.completion, 30);
  assert.equal(p3.wait, 27);
});

test('fcfs 不同到达时间（CPU 空闲等待）', () => {
  const r = fcfs([
    { id: 'A', arrival: 0, burst: 2 },
    { id: 'B', arrival: 5, burst: 3 },
  ]);
  // A 跑 0-2，CPU 空闲至 5，B 跑 5-8
  const b = r.stats.find((s) => s.id === 'B')!;
  assert.equal(b.start, 5);
  assert.equal(b.wait, 0);
  assert.equal(b.completion, 8);
  assert.equal(b.turnaround, 3);
});

test('fcfs 平均周转时间', () => {
  const r = fcfs(JOBS);
  // P1=24, P2=27, P3=30 → (24+27+30)/3 = 27
  assert.equal(r.avgTurnaround, 27);
});

test('fcfs 空输入', () => {
  const r = fcfs([]);
  assert.deepEqual(r.stats, []);
  assert.deepEqual(r.segments, []);
  assert.equal(r.avgWait, 0);
});

test('fcfs 平局按 id 字典序', () => {
  const r = fcfs([
    { id: 'Z', arrival: 0, burst: 1 },
    { id: 'A', arrival: 0, burst: 1 },
  ]);
  assert.deepEqual(
    r.stats.map((s) => s.id),
    ['A', 'Z'],
  );
});

test('fcfs 钩子被调用', () => {
  let dispatches = 0;
  let completes = 0;
  fcfs(JOBS, {
    onDispatch: () => dispatches++,
    onComplete: () => completes++,
  });
  assert.equal(dispatches, 3);
  assert.equal(completes, 3);
});

test('fcfs onDispatch startTime 正确', () => {
  const starts: Record<string, number> = {};
  fcfs(JOBS, {
    onDispatch: (job, startTime) => {
      starts[job.id] = startTime;
    },
  });
  assert.equal(starts['P1'], 0);
  assert.equal(starts['P2'], 24);
  assert.equal(starts['P3'], 27);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 5);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '终帧应有 bars');
});

test('buildTrace 每段 label 含进程 id', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  const last = frames[frames.length - 1]!;
  const ids = last.bars!.map((b) => b.label!.split('[')[0]);
  assert.deepEqual(ids, ['P1', 'P2', 'P3', 'P4']);
});
