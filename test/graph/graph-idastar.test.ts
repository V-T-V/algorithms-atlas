import { test } from 'node:test';
import assert from 'node:assert/strict';
import { idaStar } from '../../src/algorithms/graph/graph-idastar/impl.ts';

test('idastar 线性空间', () => {
  const r = idaStar({
    start: 0,
    isGoal: (s) => s === 6,
    next: (s) => (s < 6 ? [s + 1] : []),
    h: (s) => Math.abs(6 - s),
  });
  assert.equal(r.found, true);
  assert.equal(r.cost, 6);
  assert.deepEqual(r.path, [0, 1, 2, 3, 4, 5, 6]);
});

test('idastar 带跳边的最短', () => {
  // next(0)=[1,2] 提供 0->2 的跳边；其余 next(s)=[s+1]。
  // 路径 0->2->3->4 共 3 条边，每条 cost 1 => cost=3
  const r = idaStar({
    start: 0,
    isGoal: (s) => s === 4,
    next: (s) => (s === 0 ? [1, 2] : s < 4 ? [s + 1] : []),
    h: (s) => Math.abs(4 - s),
  });
  assert.equal(r.found, true);
  assert.equal(r.cost, 3);
  assert.deepEqual(r.path, [0, 2, 3, 4]);
});

test('idastar 无解', () => {
  const r = idaStar({
    start: 0,
    isGoal: (s) => s === 5,
    next: (s) => (s < 2 ? [s + 1] : []),
    h: () => 1,
  });
  assert.equal(r.found, false);
});

test('idastar 起点即目标', () => {
  const r = idaStar({
    start: 3,
    isGoal: (s) => s === 3,
    next: () => [],
    h: () => 0,
  });
  assert.equal(r.found, true);
  assert.equal(r.cost, 0);
});

test('idastar 避免环', () => {
  // 0<->1 双向，但 goal=2 通过 1
  const r = idaStar({
    start: 0,
    isGoal: (s) => s === 2,
    next: (s) => {
      if (s === 0) return [1];
      if (s === 1) return [0, 2];
      return [];
    },
    h: (s) => Math.abs(2 - s),
  });
  assert.equal(r.found, true);
  assert.deepEqual(r.path, [0, 1, 2]);
});
