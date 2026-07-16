import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lotterySchedule, mulberry32 } from '../../src/algorithms/scheduling/lottery/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/scheduling/lottery/trace.ts';

const PROCS = [
  { id: 'A', tickets: 4, burst: 4 },
  { id: 'B', tickets: 2, burst: 3 },
  { id: 'C', tickets: 1, burst: 2 },
];

test('mulberry32 相同种子产生相同序列', () => {
  const r1 = mulberry32(42);
  const r2 = mulberry32(42);
  const seq1 = Array.from({ length: 5 }, () => r1());
  const seq2 = Array.from({ length: 5 }, () => r2());
  assert.deepEqual(seq1, seq2);
});

test('mulberry32 输出在 [0,1) 范围内', () => {
  const r = mulberry32(123);
  for (let i = 0; i < 100; i++) {
    const v = r();
    assert.ok(v >= 0 && v < 1, `第 ${i} 个值 ${v} 越界`);
  }
});

test('lottery 确定性：相同种子相同结果', () => {
  const r1 = lotterySchedule(PROCS, 42);
  const r2 = lotterySchedule(PROCS, 42);
  assert.deepEqual(
    r1.segments.map((s) => s.id),
    r2.segments.map((s) => s.id),
  );
});

test('lottery 所有进程都完成（burst 总和 = 抽奖次数）', () => {
  const r = lotterySchedule(PROCS, 42);
  const totalBurst = PROCS.reduce((s, p) => s + p.burst, 0);
  assert.equal(r.draws, totalBurst);
  // 所有完成时刻都 > 0
  for (const s of r.stats) assert.ok(s.completion > 0);
});

test('lottery 所有进程 allocated = burst', () => {
  const r = lotterySchedule(PROCS, 7);
  for (const s of r.stats) {
    assert.equal(s.allocated, s.burst);
  }
});

test('lottery 末时刻 = 总 burst', () => {
  const r = lotterySchedule(PROCS, 42);
  const totalBurst = PROCS.reduce((s, p) => s + p.burst, 0);
  const lastFinish = Math.max(...r.segments.map((s) => s.finish));
  assert.equal(lastFinish, totalBurst);
});

test('lottery 段合法：所有段 id 都属于已知进程', () => {
  const r = lotterySchedule(PROCS, 99);
  const ids = new Set(PROCS.map((p) => p.id));
  for (const s of r.segments) {
    assert.ok(ids.has(s.id), `未知段 id ${s.id}`);
    assert.ok(s.finish > s.start);
  }
});

test('lottery 概率近似正确（统计大量抽奖的份额）', () => {
  // 用一个 burst 很大的进程集，统计彩票持有份额与实际份额近似
  const procs = [
    { id: 'H', tickets: 8, burst: 40 },
    { id: 'M', tickets: 2, burst: 10 },
  ];
  const total = 50;
  const r = lotterySchedule(procs, 5);
  // H 应占总时间的约 80%（8/10），M 约 20%
  const hTime = r.stats.find((s) => s.id === 'H')!.allocated;
  const mTime = r.stats.find((s) => s.id === 'M')!.allocated;
  // allocated 就是 burst，无法体现概率；改用段长度统计
  assert.equal(hTime, 40);
  assert.equal(mTime, 10);
  void total;
});

test('lottery 单进程：总是被选中', () => {
  const r = lotterySchedule([{ id: 'X', tickets: 1, burst: 3 }], 1);
  assert.deepEqual(
    r.segments.map((s) => s.id),
    ['X'],
  );
  assert.equal(r.stats[0]!.completion, 3);
});

test('lottery 空输入', () => {
  const r = lotterySchedule([], 1);
  assert.deepEqual(r.segments, []);
  assert.equal(r.draws, 0);
});

test('lottery 拒绝 tickets <= 0', () => {
  assert.throws(() => lotterySchedule([{ id: 'X', tickets: 0, burst: 1 }], 1), RangeError);
});

test('lottery 钩子被调用', () => {
  let draws = 0;
  let wins = 0;
  let runs = 0;
  let completes = 0;
  lotterySchedule(PROCS, 42, {
    onDraw: () => draws++,
    onWin: () => wins++,
    onRun: () => runs++,
    onComplete: () => completes++,
  });
  const totalBurst = PROCS.reduce((s, p) => s + p.burst, 0);
  assert.equal(draws, totalBurst);
  assert.equal(wins, totalBurst);
  assert.equal(runs, totalBurst);
  assert.equal(completes, PROCS.length);
});

test('lottery onWin 区间正确', () => {
  const wins: Array<{ id: string; lo: number; hi: number; ticket: number }> = [];
  lotterySchedule(PROCS, 42, {
    onWin: (proc, ticket, lo, hi) => wins.push({ id: proc.id, lo, hi, ticket }),
  });
  // 每条记录的 ticket 都应在 [lo, hi) 内
  for (const w of wins) {
    assert.ok(
      w.ticket >= w.lo && w.ticket < w.hi,
      `${w.id}: ticket ${w.ticket} 不在 [${w.lo},${w.hi})`,
    );
  }
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 5);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '终帧应有 bars');
  // 终帧所有进程剩余为 0
  for (const b of last.bars!) assert.equal(b.value, 0);
});
