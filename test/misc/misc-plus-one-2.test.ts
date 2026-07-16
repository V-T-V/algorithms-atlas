import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscPlusOne2 } from '../../src/algorithms/misc/misc-plus-one-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-plus-one-2/trace.ts';
test('plus one [1,2,3]→[1,2,4]', () => {
  assert.deepEqual(miscPlusOne2([1, 2, 3]), [1, 2, 4]);
});
test('plus one [9,9,9]→[1,0,0,0]', () => {
  assert.deepEqual(miscPlusOne2([9, 9, 9]), [1, 0, 0, 0]);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
