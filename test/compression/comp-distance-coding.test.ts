import { test } from 'node:test';
import assert from 'node:assert/strict';
import { distanceCoding } from '../../src/algorithms/compression/comp-distance-coding/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-distance-coding/trace.ts';
test('dc 首次出现输出符号', () => {
  assert.equal(distanceCoding([5, 5])[0], 5);
  assert.equal(distanceCoding([5, 5])[1], 1);
});
test('dc trace 非空', () => assert.ok(buildTrace().length >= 2));
