import { test } from 'node:test';
import assert from 'node:assert/strict';
import { QueryBuilder } from '../../src/algorithms/design/design-fluent-builder/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-fluent-builder/trace.ts';

test('fluent builder 链式构建', () => {
  const q = new QueryBuilder().from('users').select('id', 'name').where('x=1').limit(5).build();
  assert.equal(q.table, 'users');
  assert.deepEqual(q.columns, ['id', 'name']);
  assert.equal(q.where, 'x=1');
  assert.equal(q.limit, 5);
});
test('fluent builder 可选字段缺省', () => {
  const q = new QueryBuilder().from('t').build();
  assert.equal(q.where, undefined);
  assert.equal(q.limit, undefined);
});
test('fluent builder trace 非空', () => assert.ok(buildTrace().length > 0));
