import { test } from 'node:test';
import assert from 'node:assert/strict';
import { copyRandomList, type RNode } from '../../src/algorithms/list/list-copy-random-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-copy-random-2/trace.ts';
test('copyRandomList 深拷贝', () => {
  const n1: RNode = { value: 1, next: null, random: null };
  const n2: RNode = { value: 2, next: null, random: null };
  n1.next = n2;
  n1.random = n2;
  n2.random = n1;
  const c1 = copyRandomList(n1)!;
  assert.equal(c1.value, 1);
  assert.equal(c1.next!.value, 2);
  assert.equal(c1.random!.value, 2);
  assert.equal(c1.next!.random!.value, 1);
  assert.notEqual(c1, n1); // 独立对象
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
