import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Multiton } from '../../src/algorithms/design/design-multiton/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-multiton/trace.ts';
test('multiton 同键同实例', () => {
  const m = new Multiton();
  assert.equal(m.get('a'), m.get('a'));
  assert.notEqual(m.get('a'), m.get('b'));
});
test('multiton 大小', () => {
  const m = new Multiton();
  m.get('x');
  m.get('y');
  m.get('x');
  assert.equal(m.size(), 2);
});
test('multiton trace 非空', () => assert.ok(buildTrace().length > 0));
