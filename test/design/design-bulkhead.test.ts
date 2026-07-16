import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Bulkhead } from '../../src/algorithms/design/design-bulkhead/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-bulkhead/trace.ts';

test('bulkhead 池满拒绝', async () => {
  const b = new Bulkhead();
  const p1 = b.runInPool('db', 1, () => new Promise<number>((r) => setTimeout(() => r(1), 50)));
  await assert.rejects(() => b.runInPool('db', 1, async () => 2), /pool db full/);
  await p1;
});
test('bulkhead 不同池互不影响', async () => {
  const b = new Bulkhead();
  const a = b.runInPool('A', 1, async () => 1);
  const c = b.runInPool('B', 1, async () => 2);
  assert.equal(await a, 1);
  assert.equal(await c, 2);
});
test('bulkhead trace 非空', () => assert.ok(buildTrace().length > 0));
