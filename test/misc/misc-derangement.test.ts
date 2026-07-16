import { test } from 'node:test';
import assert from 'node:assert/strict';
import { derangement } from '../../src/algorithms/misc/misc-derangement/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-derangement/trace.ts';
test('!0..!4', () => {
  assert.deepEqual(derangement(4), [1, 0, 1, 2, 9]);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
