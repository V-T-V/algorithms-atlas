import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectIdle } from '../../src/algorithms/scheduling/sched-idle-detect/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-idle-detect/trace.ts';
test('detectIdle 正确', () => {
  const idles = detectIdle(
    [
      { id: 'A', start: 0, end: 3 },
      { id: 'B', start: 5, end: 7 },
    ],
    8,
  );
  assert.equal(idles.length, 1);
  assert.equal(idles[0]!.start, 3);
  assert.equal(idles[0]!.end, 5);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
