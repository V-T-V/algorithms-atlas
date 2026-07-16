import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mlfq } from '../../src/algorithms/scheduling/sched-multilevel-feedback-3/impl.ts';

test('mlfq 全部完成', () => {
  const r = mlfq(
    [
      { pid: 'P1', arrival: 0, burst: 8 },
      { pid: 'P2', arrival: 0, burst: 4 },
      { pid: 'P3', arrival: 0, burst: 2 },
    ],
    3,
    [2, 4, 8],
  );
  // 手工模拟：P3 先在 Q0 完成于 t=6，P2 完成于 t=12，P1 完成于 t=14
  assert.equal(r.completion.P3, 6);
  assert.equal(r.completion.P2, 12);
  assert.equal(r.completion.P1, 14);
  // P3（短作业）应最先完成
  assert.ok(r.completion.P3! < r.completion.P1!);
});

test('mlfq 降级触发', () => {
  let demoted = false;
  mlfq([{ pid: 'X', arrival: 0, burst: 10 }], 3, [2, 4, 8], { onDemote: () => (demoted = true) });
  assert.ok(demoted);
});

test('mlfq 单进程时间总和 = burst', () => {
  const r = mlfq([{ pid: 'A', arrival: 0, burst: 6 }], 3, [2, 4, 8]);
  const total = r.timeline.reduce((s, seg) => s + (seg.end - seg.start), 0);
  assert.equal(total, 6);
});

test('mlfq IO 让出保持优先级', () => {
  // burst=6, 在已跑 2 时让出 → 不降级，仍在 Q0
  let stayedAtQ0 = false;
  const r = mlfq([{ pid: 'IO', arrival: 0, burst: 6, ioPoints: [2] }], 3, [2, 4, 8], {
    onDispatch: (_pid, level) => {
      if (level === 0) stayedAtQ0 = true;
    },
  });
  assert.ok(stayedAtQ0);
  assert.equal(r.completion.IO, 6);
});
