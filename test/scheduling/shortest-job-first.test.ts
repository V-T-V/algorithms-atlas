import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shortestJobFirst } from '../../src/algorithms/scheduling/shortest-job-first/impl.ts';

const JOBS = [
  { id: 'J1', arrival: 0, burst: 8 },
  { id: 'J2', arrival: 1, burst: 4 },
  { id: 'J3', arrival: 2, burst: 2 },
  { id: 'J4', arrival: 3, burst: 1 },
];

test('shortest-job-first 调度顺序与时间', () => {
  const r = shortestJobFirst(JOBS);
  // J1 必须先跑（t=0 时唯一到达），之后按 burst 选 J4(1)→J3(2)→J2(4)
  assert.deepEqual(
    r.map((j) => j.id),
    ['J1', 'J4', 'J3', 'J2'],
  );
  assert.equal(r[0]!.start, 0);
  assert.equal(r[0]!.finish, 8);
  assert.equal(r[1]!.start, 8); // J4 在 J1 完成后立即开始
  assert.equal(r[1]!.finish, 9);
  assert.equal(r[3]!.finish, 15);
});

test('shortest-job-first 等待与周转时间', () => {
  const r = shortestJobFirst(JOBS);
  const j4 = r.find((j) => j.id === 'J4')!;
  assert.equal(j4.waiting, 8 - 3); // start(8) - arrival(3)
  assert.equal(j4.turnaround, 9 - 3);
});

test('shortest-job-first 全部同时到达选最短', () => {
  const r = shortestJobFirst([
    { id: 'A', arrival: 0, burst: 5 },
    { id: 'B', arrival: 0, burst: 2 },
    { id: 'C', arrival: 0, burst: 3 },
  ]);
  assert.deepEqual(
    r.map((j) => j.id),
    ['B', 'C', 'A'],
  );
});

test('shortest-job-first 钩子被调用', () => {
  let picks = 0;
  let completes = 0;
  shortestJobFirst(JOBS, {
    onPick: () => picks++,
    onComplete: () => completes++,
  });
  assert.equal(picks, JOBS.length);
  assert.equal(completes, JOBS.length);
});
