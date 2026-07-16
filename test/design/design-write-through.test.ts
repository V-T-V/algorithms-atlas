import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WriteThroughCache } from '../../src/algorithms/design/design-write-through/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-write-through/trace.ts';

test('write-through 读必命中缓存', () => {
  const c = new WriteThroughCache<string, number>();
  c.write('x', 42);
  assert.equal(c.read('x'), 42);
});
test('write-through 未写返回 undefined', () => {
  const c = new WriteThroughCache<string, number>();
  assert.equal(c.read('x'), undefined);
});
test('write-through trace 非空', () => assert.ok(buildTrace().length > 0));
