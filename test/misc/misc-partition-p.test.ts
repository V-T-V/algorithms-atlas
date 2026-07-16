import { test } from 'node:test';
import assert from 'node:assert/strict';
import { partitionP } from '../../src/algorithms/misc/misc-partition-p/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-partition-p/trace.ts';
test('p(0..5)', () => {
  assert.deepEqual(partitionP(5), [1, 1, 2, 3, 5, 7]);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
