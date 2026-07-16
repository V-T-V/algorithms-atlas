import { test } from 'node:test';
import assert from 'node:assert/strict';
import { responseRatios } from '../../src/algorithms/scheduling/sched-response-ratio/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-response-ratio/trace.ts';
test('responseRatios 正确', () => {
  const rs = responseRatios(
    [
      { id: 'A', arrival: 0, burst: 4 },
      { id: 'B', arrival: 0, burst: 2 },
    ],
    4,
  );
  assert.equal(rs.get('A'), 2);
  assert.equal(rs.get('B'), 3);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
