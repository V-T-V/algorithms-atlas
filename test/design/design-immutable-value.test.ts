import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Money } from '../../src/algorithms/design/design-immutable-value/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-immutable-value/trace.ts';
test('immutable 返回新实例', () => {
  const a = new Money(5, 'USD');
  const b = a.multiply(2);
  assert.equal(a.amount, 5);
  assert.equal(b.amount, 10);
  assert.notEqual(a, b);
});
test('immutable equals', () => assert.ok(new Money(1, 'X').equals(new Money(1, 'X'))));
test('immutable trace 非空', () => assert.ok(buildTrace().length > 0));
