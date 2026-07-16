import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WriteBehindCache } from '../../src/algorithms/design/design-write-behind/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-write-behind/trace.ts';

test('write-behind dirty 跟踪', () => {
  const c = new WriteBehindCache<string, number>();
  c.write('a', 1);
  c.write('b', 2);
  assert.equal(c.dirtyCount(), 2);
});
test('write-behind flush 后清空', async () => {
  const c = new WriteBehindCache<string, number>();
  c.write('a', 1);
  const flushed: [string, number][] = [];
  const n = await c.flush(async (k, v) => {
    flushed.push([k, v]);
  });
  assert.equal(n, 1);
  assert.deepEqual(flushed, [['a', 1]]);
  assert.equal(c.dirtyCount(), 0);
});
test('write-behind trace 非空', () => assert.ok(buildTrace().length > 0));
