import { test } from 'node:test';
import assert from 'node:assert/strict';
import { roundRobinQuantum } from '../../src/algorithms/scheduling/sched-rr-quantum-2/impl.ts';

test('roundRobinQuantum 基本', () => {
  const r = roundRobinQuantum([
    { pid: 'P1', arrival: 0, burst: 5, quantum: 2 },
    { pid: 'P2', arrival: 0, burst: 3, quantum: 2 },
    { pid: 'P3', arrival: 0, burst: 1, quantum: 2 },
  ]);
  // 所有进程都从 0 到达；总时间 9；全部完成
  assert.equal(Object.keys(r.completion).length, 3);
  assert.ok(r.completion.P1! > 0);
  assert.ok(r.completion.P2! > 0);
  assert.ok(r.completion.P3! > 0);
  // 周转时间 = 完成 - 到达；等待 = 周转 - burst
  for (const pid of ['P1', 'P2', 'P3']) {
    assert.equal(r.turnaround[pid], r.completion[pid]);
    assert.equal(r.waiting[pid], r.completion[pid]! - { P1: 5, P2: 3, P3: 1 }[pid]!);
  }
});

test('roundRobinQuantum 时间片足够大', () => {
  // quantum 大于所有 burst，等价于 FCFS（按到达顺序）
  const r = roundRobinQuantum([
    { pid: 'A', arrival: 0, burst: 3, quantum: 10 },
    { pid: 'B', arrival: 0, burst: 2, quantum: 10 },
  ]);
  assert.equal(r.completion.A, 3);
  assert.equal(r.completion.B, 5);
});

test('roundRobinQuantum 到达时间不同', () => {
  const r = roundRobinQuantum([
    { pid: 'X', arrival: 0, burst: 4, quantum: 2 },
    { pid: 'Y', arrival: 3, burst: 2, quantum: 2 },
  ]);
  // X 先跑 0-2，剩 2；t=2 时 Y 还没到，X 再跑 2-4 完成；
  // t=4 时 Y 到达（arrival=3 在 2-4 期间），Y 跑 4-6 完成
  assert.equal(r.completion.X, 4);
  assert.equal(r.completion.Y, 6);
});

test('roundRobinQuantum 可变量子', () => {
  const r = roundRobinQuantum([
    { pid: 'H', arrival: 0, burst: 4, quantum: 4 }, // 大量子
    { pid: 'L', arrival: 0, burst: 4, quantum: 1 }, // 小量子
  ]);
  // H 先跑完 4 个；L 跑 1 三次再加 1
  assert.equal(r.completion.H, 4);
  assert.equal(r.completion.L, 8);
});

test('roundRobinQuantum 时间线连续', () => {
  const r = roundRobinQuantum([{ pid: 'A', arrival: 0, burst: 3, quantum: 1 }]);
  assert.equal(r.timeline.length, 3);
  assert.equal(r.timeline[0]!.start, 0);
  assert.equal(r.timeline[2]!.end, 3);
});
