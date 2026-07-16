import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rectangularAssignment } from '../../src/algorithms/network/net-assignment-rectangular/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-assignment-rectangular/trace.ts';

test('net-assignment-rectangular 工多于任务', () => {
  // 4 工 3 任务，3 个任务必被配
  const cost = [
    [4, 1, 3],
    [2, 5, 8],
    [6, 3, 2],
    [7, 9, 4],
  ];
  const r = rectangularAssignment(cost);
  assert.equal(r.pairs.length, 3);
  // 任务互异
  const tasks = new Set(r.pairs.map((p) => p.task));
  assert.equal(tasks.size, 3);
});

test('net-assignment-rectangular 任务多于工', () => {
  const cost = [[1, 2, 3, 4]];
  const r = rectangularAssignment(cost);
  assert.equal(r.pairs.length, 1);
  assert.equal(r.pairs[0]!.task, 0); // 最小代价任务 0
  assert.equal(r.totalCost, 1);
});

test('net-assignment-rectangular 方阵退化', () => {
  const cost = [
    [1, 9],
    [9, 1],
  ];
  const r = rectangularAssignment(cost);
  assert.equal(r.totalCost, 2);
});

test('net-assignment-rectangular 费用一致', () => {
  const cost = [
    [4, 1, 3],
    [2, 5, 8],
    [6, 3, 2],
    [7, 9, 4],
  ];
  const r = rectangularAssignment(cost);
  assert.equal(
    r.pairs.reduce((s, p) => s + p.cost, 0),
    r.totalCost,
  );
});

test('net-assignment-rectangular trace', () => {
  assert.ok(buildTrace().length >= 2);
});
