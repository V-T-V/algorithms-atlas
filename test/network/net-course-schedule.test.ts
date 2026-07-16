import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canFinish } from '../../src/algorithms/network/net-course-schedule/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-course-schedule/trace.ts';
test('canFinish 正确', () => {
  assert.equal(
    canFinish(4, [
      [1, 0],
      [2, 1],
      [3, 2],
    ]),
    true,
  );
  assert.equal(
    canFinish(2, [
      [0, 1],
      [1, 0],
    ]),
    false,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
