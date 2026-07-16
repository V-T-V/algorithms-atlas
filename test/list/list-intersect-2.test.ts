import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getIntersection } from '../../src/algorithms/list/list-intersect-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-intersect-2/trace.ts';
test('getIntersection 有交点', () => {
  const shared: any = { value: 8, next: { value: 10, next: null } };
  const a: any = { value: 1, next: { value: 2, next: shared } };
  const b: any = { value: 3, next: shared };
  assert.equal(getIntersection(a, b), shared);
});
test('getIntersection 无交点', () => {
  const a: any = { value: 1, next: { value: 2, next: null } };
  const b: any = { value: 3, next: { value: 4, next: null } };
  assert.equal(getIntersection(a, b), null);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
