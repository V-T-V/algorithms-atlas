import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cfsSchedule } from '../../src/algorithms/scheduling/sched-cfs-vruntime-2/impl.ts';

test('cfsSchedule 全部完成', () => {
  const r = cfsSchedule(
    [
      { pid: 'A', arrival: 0, burst: 4, weight: 1024 },
      { pid: 'B', arrival: 0, burst: 4, weight: 1024 },
    ],
    1,
  );
  // 等权交替：A 先（平手取数组序），各自最后一步错开 1
  assert.equal(r.completion.A, 7);
  assert.equal(r.completion.B, 8);
  assert.equal(r.timeline[0]!.pid, 'A');
  assert.equal(r.timeline[1]!.pid, 'B');
});

test('cfsSchedule 高权重先获更多 CPU（完成更早）', () => {
  const r = cfsSchedule(
    [
      { pid: 'HI', arrival: 0, burst: 10, weight: 4096 },
      { pid: 'LO', arrival: 0, burst: 10, weight: 256 },
    ],
    1,
  );
  // 两者都应完成，总 CPU 各 10 单位
  assert.ok(r.completion.HI! > 0);
  assert.ok(r.completion.LO! > 0);
  // HI 因 vruntime 增长慢，应比 LO 更早完成（连续获得更多早期 CPU）
  assert.ok(
    r.completion.HI! <= r.completion.LO!,
    `HI=${r.completion.HI} should finish no later than LO=${r.completion.LO}`,
  );
});

test('cfsSchedule 单进程', () => {
  const r = cfsSchedule([{ pid: 'X', arrival: 0, burst: 5, weight: 1024 }], 2);
  assert.equal(r.completion.X, 5);
});

test('cfsSchedule 钩子', () => {
  let picks = 0;
  cfsSchedule([{ pid: 'A', arrival: 0, burst: 3, weight: 1024 }], 1, 1024, {
    onPick: () => picks++,
  });
  assert.equal(picks, 3);
});
