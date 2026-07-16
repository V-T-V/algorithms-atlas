import { test } from 'node:test';
import assert from 'node:assert/strict';
import { segmentCover } from '../../src/algorithms/greedy/greedy-line-arrangement/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-line-arrangement/trace.ts';
test('密集点用 1 段', () => {
  assert.equal(segmentCover([1, 2, 3], 5), 1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
