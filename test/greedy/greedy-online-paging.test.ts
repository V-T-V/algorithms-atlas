import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onlinePagingLru } from '../../src/algorithms/greedy/greedy-online-paging/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-online-paging/trace.ts';
test('重复访问缓存内页全命中', () => {
  const r = onlinePagingLru([1, 1, 1], 2);
  assert.equal(r.hits, 2);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
