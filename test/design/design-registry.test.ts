import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Registry } from '../../src/algorithms/design/design-registry/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-registry/trace.ts';

test('registry 注册与查找', () => {
  const r = new Registry<number>();
  r.register('x', 42);
  assert.equal(r.lookup('x'), 42);
  assert.equal(r.lookup('y'), undefined);
  assert.equal(r.has('x'), true);
});
test('registry names 列出全部', () => {
  const r = new Registry<number>();
  r.register('a', 1);
  r.register('b', 2);
  assert.deepEqual(r.names().sort(), ['a', 'b']);
});
test('registry trace 非空', () => assert.ok(buildTrace().length > 0));
