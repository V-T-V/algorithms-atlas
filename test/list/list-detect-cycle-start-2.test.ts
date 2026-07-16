import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectCycleStart } from '../../src/algorithms/list/list-detect-cycle-start-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-detect-cycle-start-2/trace.ts';
test('detectCycleStart 找到入口', () => {
  const n1: any = { value: 1, next: null },
    n2: any = { value: 2, next: null },
    n3: any = { value: 3, next: null },
    n4: any = { value: 4, next: null };
  n1.next = n2;
  n2.next = n3;
  n3.next = n4;
  n4.next = n2;
  assert.equal(detectCycleStart(n1), n2);
});
test('detectCycleStart 无环', () => {
  const n1: any = { value: 1, next: { value: 2, next: null } };
  assert.equal(detectCycleStart(n1), null);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
