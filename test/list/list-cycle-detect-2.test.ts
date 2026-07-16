import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, hasCycle } from '../../src/algorithms/list/list-cycle-detect-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-cycle-detect-2/trace.ts';
test('hasCycle 无环', () => {
  assert.equal(hasCycle(buildList([1, 2, 3, 4])), false);
  assert.equal(hasCycle(null), false);
});
test('hasCycle 有环', () => {
  const a: any = { value: 1, next: null },
    b: any = { value: 2, next: null },
    c: any = { value: 3, next: null };
  a.next = b;
  b.next = c;
  c.next = b;
  assert.equal(hasCycle(a), true);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
