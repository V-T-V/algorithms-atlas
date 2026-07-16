import { test } from 'node:test';
import assert from 'node:assert/strict';
import { precedenceSchedule } from '../../src/algorithms/scheduling/sched-precedence/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-precedence/trace.ts';
test('precedenceSchedule 正确', () => {
  const r = precedenceSchedule([
    { id: 'A', arrival: 0, burst: 2, deps: [] },
    { id: 'B', arrival: 0, burst: 3, deps: ['A'] },
    { id: 'C', arrival: 0, burst: 1, deps: ['A'] },
    { id: 'D', arrival: 0, burst: 2, deps: ['B', 'C'] },
  ]);
  assert.equal(r.order[0], 'A');
  assert.equal(r.order[r.order.length - 1], 'D');
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
