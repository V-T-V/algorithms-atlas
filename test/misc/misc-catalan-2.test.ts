import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalanSeq } from '../../src/algorithms/misc/misc-catalan-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-catalan-2/trace.ts';
test('C0..C5', () => {
  assert.deepEqual(catalanSeq(5), [1, 1, 2, 5, 14, 42]);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
