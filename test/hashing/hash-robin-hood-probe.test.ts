import { test } from 'node:test';
import assert from 'node:assert/strict';
import { robinHoodInsert } from '../../src/algorithms/hashing/hash-robin-hood-probe/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-robin-hood-probe/trace.ts';
test('Robin Hood 最大 PSL 非负', () => {
  const mx = robinHoodInsert(8, [1, 2, 3]);
  assert.ok(mx >= 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
