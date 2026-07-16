import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HsQueue } from '../../src/algorithms/design/design-half-sync-half-async/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-half-sync-half-async/trace.ts';
test('hs-async 入队+处理', () => {
  const q = new HsQueue();
  q.enqueue(1);
  q.enqueue(2);
  assert.deepEqual(q.drainSync(), [2, 4]);
});
test('hs-async trace 非空', () => assert.ok(buildTrace().length > 0));
