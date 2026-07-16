import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mlfq } from '../../src/algorithms/scheduling/mlfq/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/scheduling/mlfq/trace.ts';

const OPTS = { levels: [{ quantum: 2 }, { quantum: 4 }, { quantum: 8 }] };

test('mlfq 短任务在高优先级层完成', () => {
  const r = mlfq([{ id: 'C', arrival: 0, burst: 1 }], OPTS);
  // burst=1 < quantum=2 → 一段在 L0 完成
  assert.equal(r.segments[0]!.level, 0);
  assert.equal(r.stats[0]!.finalLevel, 0);
});

test('mlfq 长任务会逐层降级', () => {
  const r = mlfq([{ id: 'A', arrival: 0, burst: 7 }], OPTS);
  // L0 q=2 (用完降级), L1 q=4 (用完降级), L2 q=8 (剩 1 完成)
  const levels = r.segments.map((s) => s.level);
  assert.deepEqual(levels, [0, 1, 2]);
  // finalLevel = 2
  assert.equal(r.stats[0]!.finalLevel, 2);
});

test('mlfq 用完时间片降级（demote 钩子）', () => {
  const demotes: Array<[string, number, number]> = [];
  mlfq([{ id: 'A', arrival: 0, burst: 5 }], OPTS, {
    onDemote: (j, f, t) => demotes.push([j.id, f, t]),
  });
  // A: L0 跑 2（降 0→1），L1 跑 4 中跑满... burst=5：L0 跑2剩3(降级), L1 跑 min(4,3)=3 完成
  // 所以降级一次
  assert.equal(demotes.length, 1);
  assert.deepEqual(demotes[0], ['A', 0, 1]);
});

test('mlfq 完成时刻正确', () => {
  const r = mlfq([{ id: 'A', arrival: 0, burst: 7 }], OPTS);
  // 2+4+1 = 7
  assert.equal(r.stats[0]!.finish, 7);
});

test('mlfq 多进程高优先级层 RR', () => {
  const r = mlfq(
    [
      { id: 'A', arrival: 0, burst: 1 },
      { id: 'B', arrival: 0, burst: 1 },
    ],
    OPTS,
  );
  // 都在 L0 完成
  assert.equal(r.segments[0]!.level, 0);
  assert.equal(r.segments[1]!.level, 0);
});

test('mlfq 周期提升防饿死', () => {
  const boosts: number[] = [];
  // 长任务 A 一直占用低层，短任务 B 后到；boost 后 B 应能在 L0 跑
  const r = mlfq(
    [
      { id: 'A', arrival: 0, burst: 10 },
      { id: 'B', arrival: 0, burst: 2 },
    ],
    { levels: [{ quantum: 2 }, { quantum: 8 }], boostInterval: 6 },
    { onBoost: (t) => boosts.push(t) },
  );
  void r;
  // 应有至少一次提升
  assert.ok(boosts.length >= 1);
});

test('mlfq 空输入', () => {
  const r = mlfq([], OPTS);
  assert.deepEqual(r.segments, []);
});

test('mlfq 平均等待时间', () => {
  const r = mlfq(
    [
      { id: 'A', arrival: 0, burst: 1 },
      { id: 'B', arrival: 0, burst: 1 },
    ],
    OPTS,
  );
  // A finish=1, B finish=2 → 等待 A=0, B=1 → avg 0.5
  assert.equal(r.avgWaiting, 0.5);
});

test('mlfq 钩子 onRun 触发次数', () => {
  let runs = 0;
  mlfq([{ id: 'A', arrival: 0, burst: 7 }], OPTS, { onRun: () => runs++ });
  assert.equal(runs, 3); // 3 段
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
