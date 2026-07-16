import { test } from 'node:test';
import assert from 'node:assert/strict';
import { srtf } from '../../src/algorithms/scheduling/srtf/impl.ts';
import { fcfs } from '../../src/algorithms/scheduling/fcfs/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/scheduling/srtf/trace.ts';

// 经典 SRTF 例
const JOBS = [
  { id: 'P1', arrival: 0, burst: 7 },
  { id: 'P2', arrival: 2, burst: 4 },
  { id: 'P3', arrival: 4, burst: 1 },
  { id: 'P4', arrival: 5, burst: 4 },
];

test('srtf 完成时刻正确', () => {
  const r = srtf(JOBS);
  const comp = (id: string) => r.stats.find((s) => s.id === id)!.completion;
  // 手算：P1 0→2(rem5), P2 2→4(rem2), P3 4→5(完), P2 5→7(完), P4 7→11(完), P1 11→16(完)
  assert.equal(comp('P3'), 5);
  assert.equal(comp('P2'), 7);
  assert.equal(comp('P4'), 11);
  assert.equal(comp('P1'), 16);
});

test('srtf 抢占 P1：P2 到达后抢占', () => {
  const r = srtf(JOBS);
  // 第一段是 P1（t=0-2），P2 到达后剩余更短，抢占
  const firstSeg = r.segments[0]!;
  assert.equal(firstSeg.id, 'P1');
  assert.equal(firstSeg.start, 0);
  assert.equal(firstSeg.finish, 2);
});

test('srtf 段顺序合理（首段 P1，含抢占切换）', () => {
  const r = srtf(JOBS);
  const ids = r.segments.map((s) => s.id);
  assert.equal(ids[0], 'P1');
  assert.ok(ids.length >= 4, '抢占式应产生多个段');
});

test('srtf 平均等待时间 < fcfs', () => {
  // SRTF 平均等待时间优于 FCFS（同一组作业）
  const srtfR = srtf(JOBS);
  const fcfsR = fcfs(JOBS);
  assert.ok(
    srtfR.avgWait <= fcfsR.avgWait,
    `SRTF avgWait(${srtfR.avgWait}) 应 <= FCFS avgWait(${fcfsR.avgWait})`,
  );
});

test('srtf 等待与周转自洽', () => {
  const r = srtf(JOBS);
  for (const s of r.stats) {
    assert.equal(
      s.wait + s.burst + s.arrival,
      s.completion,
      `${s.id}: wait+burst+arrival=completion`,
    );
    assert.equal(s.turnaround, s.completion - s.arrival);
    assert.equal(s.wait, s.turnaround - s.burst);
  }
});

test('srtf 平均周转正确', () => {
  const r = srtf(JOBS);
  const avgTurn = r.stats.reduce((s, x) => s + x.turnaround, 0) / JOBS.length;
  assert.equal(r.avgTurnaround, avgTurn);
});

test('srtf 空输入', () => {
  const r = srtf([]);
  assert.deepEqual(r.segments, []);
  assert.deepEqual(r.stats, []);
  assert.equal(r.avgWait, 0);
});

test('srtf 无抢占（所有同时到达退化为 SJF）', () => {
  const r = srtf([
    { id: 'A', arrival: 0, burst: 5 },
    { id: 'B', arrival: 0, burst: 1 },
    { id: 'C', arrival: 0, burst: 3 },
  ]);
  // 同时到达 → 无抢占，顺序按 burst：B(1), C(3), A(5)
  assert.deepEqual(
    r.segments.map((s) => s.id),
    ['B', 'C', 'A'],
  );
});

test('srtf 相邻同 id 段被合并', () => {
  // 这个输入下 P1 跑 0-1，P2 到达但更长，P1 继续 → 应合并为单段
  const r = srtf([
    { id: 'A', arrival: 0, burst: 2 },
    { id: 'B', arrival: 1, burst: 5 },
  ]);
  const aSegs = r.segments.filter((s) => s.id === 'A');
  assert.equal(aSegs.length, 1, 'A 的相邻段应被合并');
  assert.equal(aSegs[0]!.finish, 2);
});

test('srtf 钩子被调用', () => {
  let picks = 0;
  let completes = 0;
  srtf(JOBS, {
    onPick: () => picks++,
    onComplete: () => completes++,
  });
  assert.ok(picks >= JOBS.length, '至少每个进程被选一次');
  assert.equal(completes, JOBS.length);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 5);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '终帧应有 bars');
  // 终帧所有进程剩余为 0
  for (const b of last.bars!) assert.equal(b.value, 0);
});
