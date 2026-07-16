import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Core, type Role } from '../../src/algorithms/design/design-role-object/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-role-object/trace.ts';
test('role-object 动态挂载', () => {
  const c = new Core();
  c.addRole('x', { play: () => 'a' });
  assert.equal(c.as('x')?.play(), 'a');
  assert.equal(c.as('y'), undefined);
});
test('role-object trace 非空', () => assert.ok(buildTrace().length > 0));
