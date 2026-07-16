import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hopscotchInsert } from '../../src/algorithms/hashing/hash-hopscotch-probe/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-hopscotch-probe/trace.ts';
test('Hopscotch 小规模成功', () => {
  assert.equal(hopscotchInsert(32, [1, 2, 3]), true);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
