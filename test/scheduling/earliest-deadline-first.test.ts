import { test } from 'node:test';
import assert from 'node:assert/strict';
import { earliestDeadlineFirst } from '../../src/algorithms/scheduling/earliest-deadline-first/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/scheduling/earliest-deadline-first/trace.ts';

test('edf 单作业满足截止期', () => {
  const r = earliestDeadlineFirst([{ id: 'A', arrival: 0, execution: 3, deadline: 5 }]);
  assert.equal(r.allMet, true);
  assert.equal(r.stats[0]!.finish, 3);
});

test('edf 按截止期升序运行', () => {
  const r = earliestDeadlineFirst([
    { id: 'A', arrival: 0, execution: 2, deadline: 5 },
    { id: 'B', arrival: 0, execution: 2, deadline: 3 },
  ]);
  // B 截止期更早，先运行
  assert.equal(r.segments[0]!.id, 'B');
  assert.equal(r.allMet, true);
});

test('edf 抢占：更早截止期作业到达时抢占', () => {
  const r = earliestDeadlineFirst([
    { id: 'A', arrival: 0, execution: 4, deadline: 10 },
    { id: 'B', arrival: 1, execution: 2, deadline: 4 }, // 更早截止期，到达即抢占
  ]);
  // t=0 跑 A，t=1 起 B 截止期更早 → 抢占
  assert.equal(r.segments[0]!.id, 'A');
  assert.equal(r.segments[1]!.id, 'B');
});

test('edf 利用率 <= 100% 时可调度', () => {
  // 两作业总执行 4，截止期足够
  const r = earliestDeadlineFirst([
    { id: 'A', arrival: 0, execution: 2, deadline: 4 },
    { id: 'B', arrival: 0, execution: 2, deadline: 4 },
  ]);
  assert.equal(r.allMet, true);
});

test('edf 过载时错过截止期', () => {
  // A 需要 5 但截止期 3
  const r = earliestDeadlineFirst([{ id: 'A', arrival: 0, execution: 5, deadline: 3 }]);
  assert.equal(r.allMet, false);
  assert.equal(r.missedCount, 1);
});

test('edf 空输入', () => {
  const r = earliestDeadlineFirst([]);
  assert.equal(r.allMet, true);
  assert.equal(r.makespan, 0);
});

test('edf 不同到达时间正确调度', () => {
  const r = earliestDeadlineFirst([
    { id: 'A', arrival: 0, execution: 3, deadline: 6 },
    { id: 'B', arrival: 2, execution: 2, deadline: 5 }, // 到达后截止期更早
  ]);
  assert.equal(r.allMet, true);
});

test('edf 钩子 onSchedule/onComplete', () => {
  let schedCount = 0;
  let completes = 0;
  earliestDeadlineFirst(
    [
      { id: 'A', arrival: 0, execution: 2, deadline: 5 },
      { id: 'B', arrival: 0, execution: 1, deadline: 3 },
    ],
    {
      onSchedule: () => schedCount++,
      onComplete: () => completes++,
    },
  );
  // 总执行 3，至少 3 次调度步
  assert.ok(schedCount >= 3);
  assert.equal(completes, 2);
});

test('edf 满足截止期时 metDeadline 全 true', () => {
  const r = earliestDeadlineFirst([
    { id: 'A', arrival: 0, execution: 1, deadline: 2 },
    { id: 'B', arrival: 0, execution: 1, deadline: 3 },
  ]);
  assert.ok(r.stats.every((s) => s.metDeadline));
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
