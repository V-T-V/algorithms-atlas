import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hrrn, responseRatio } from '../../src/algorithms/scheduling/hrrn/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/scheduling/hrrn/trace.ts';

const JOBS = [
  { id: 'P1', arrival: 0, burst: 8 },
  { id: 'P2', arrival: 1, burst: 4 },
  { id: 'P3', arrival: 2, burst: 2 },
  { id: 'P4', arrival: 3, burst: 1 },
];

test('responseRatio 公式正确', () => {
  assert.equal(responseRatio(0, 5), 1);
  assert.equal(responseRatio(5, 5), 2);
  assert.equal(responseRatio(10, 2), 6);
});

test('hrrn 第一个一定选 P1（t=0 仅 P1 到达）', () => {
  const r = hrrn(JOBS);
  assert.equal(r.stats[0]!.id, 'P1');
});

test('hrrn P1 完成后选响应比最高者', () => {
  const r = hrrn(JOBS);
  // t=8 时候选：P2(wait=7), P3(wait=6), P4(wait=5)
  // RR: P2=(7+4)/4=2.75, P3=(6+2)/2=4, P4=(5+1)/1=6 → P4 最高
  assert.equal(r.stats[1]!.id, 'P4');
});

test('hrrn 完整调度顺序', () => {
  const r = hrrn(JOBS);
  // P1(0-8) → P4(8-9, RR=6) → P3(9-11, RR=(7+2)/2=4.5) → P2(11-15)
  assert.deepEqual(
    r.stats.map((s) => s.id),
    ['P1', 'P4', 'P3', 'P2'],
  );
});

test('hrrn 完成时刻正确', () => {
  const r = hrrn(JOBS);
  const comp = (id: string) => r.stats.find((s) => s.id === id)!.completion;
  assert.equal(comp('P1'), 8);
  assert.equal(comp('P4'), 9);
  assert.equal(comp('P3'), 11);
  assert.equal(comp('P2'), 15);
});

test('hrrn 平均等待时间正确', () => {
  const r = hrrn(JOBS);
  // wait: P1=0, P4=8-3=5, P3=9-2=7, P2=11-1=10 → (0+5+7+10)/4 = 5.5
  assert.equal(r.avgWait, 5.5);
});

test('hrrn 平均周转时间正确', () => {
  const r = hrrn(JOBS);
  // turn: P1=8, P4=6, P3=9, P2=14 → (8+6+9+14)/4 = 9.25
  assert.equal(r.avgTurnaround, 9.25);
});

test('hrrn responseRatio 被记录', () => {
  const r = hrrn(JOBS);
  // P1 在 t=0 被选，wait=0，RR=(0+8)/8=1
  assert.equal(r.stats[0]!.responseRatio, 1);
});

test('hrrn 空输入', () => {
  const r = hrrn([]);
  assert.deepEqual(r.stats, []);
  assert.deepEqual(r.segments, []);
  assert.equal(r.avgWait, 0);
});

test('hrrn 所有同时到达 → 退化为 SJF（短作业 RR 最高）', () => {
  const r = hrrn([
    { id: 'A', arrival: 0, burst: 5 },
    { id: 'B', arrival: 0, burst: 1 },
    { id: 'C', arrival: 0, burst: 3 },
  ]);
  // 同时到达 wait=0，RR=1+0/burst=1 全部相等 → 平局按 arrival（相同）再按 id
  assert.deepEqual(
    r.stats.map((s) => s.id),
    ['A', 'B', 'C'],
  );
});

test('hrrn 钩子被调用', () => {
  let picks = 0;
  let completes = 0;
  hrrn(JOBS, {
    onPick: () => picks++,
    onComplete: () => completes++,
  });
  assert.equal(picks, 4);
  assert.equal(completes, 4);
});

test('hrrn onPick 给出所有候选', () => {
  let firstCandidates = 0;
  hrrn(JOBS, {
    onPick: (_job, _ratio, candidates) => {
      if (firstCandidates === 0) firstCandidates = candidates.length;
    },
  });
  // 第一次选 P1 时，t=0 仅 P1 到达 → 1 个候选
  assert.equal(firstCandidates, 1);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 5);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '终帧应有 bars');
});
