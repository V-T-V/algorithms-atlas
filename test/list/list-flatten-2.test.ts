import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flatten, type MNode } from '../../src/algorithms/list/list-flatten-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-flatten-2/trace.ts';
const mk = (v: number): MNode => ({ value: v, next: null, prev: null, child: null });
test('flatten 正确', () => {
  const a = mk(1),
    b = mk(2),
    c = mk(3);
  a.next = b;
  b.prev = a;
  b.child = c;
  flatten(a);
  const arr: number[] = [];
  let cur: MNode | null = a;
  while (cur) {
    arr.push(cur.value);
    cur = cur.next;
  }
  assert.deepEqual(arr, [1, 2, 3]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
