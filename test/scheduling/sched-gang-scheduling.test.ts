import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scheduleGangs } from '../../src/algorithms/scheduling/sched-gang-scheduling/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-gang-scheduling/trace.ts';

test('sched-gang-scheduling 每片同时派发', () => {
  const slots = scheduleGangs([{ id: 'G1', threads: ['a', 'b', 'c'], quantum: 2 }], 3);
  assert.equal(slots[0]!.cores.length, 3);
  assert.equal(slots[0]!.time, 0);
});

test('sched-gang-scheduling 时间片累加', () => {
  const slots = scheduleGangs(
    [
      { id: 'G1', threads: ['a'], quantum: 2 },
      { id: 'G2', threads: ['b'], quantum: 3 },
    ],
    2,
  );
  assert.equal(slots[0]!.time, 0);
  assert.equal(slots[1]!.time, 2);
});

test('sched-gang-scheduling 线程数超核数截断', () => {
  const slots = scheduleGangs([{ id: 'G1', threads: ['a', 'b', 'c', 'd'], quantum: 1 }], 2);
  assert.equal(slots[0]!.cores.length, 2);
});

test('sched-gang-scheduling trace', () => {
  assert.ok(buildTrace().length > 2);
});
