import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fairShare } from '../../src/algorithms/scheduling/sched-guaranteed/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-guaranteed/trace.ts';
test('fairShare 正确', () => {
  const r = fairShare([
    { id: 'A', arrival: 0, burst: 2, group: 'X' },
    { id: 'B', arrival: 0, burst: 3, group: 'Y' },
    { id: 'C', arrival: 0, burst: 1, group: 'X' },
  ]);
  assert.equal(r.order[0], 'A');
  assert.equal(r.order[1], 'B');
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
