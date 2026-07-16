import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CqrsStore } from '../../src/algorithms/design/design-cqrs/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-cqrs/trace.ts';

test('cqrs create + query', () => {
  const s = new CqrsStore<{ id: string; v: number }>();
  s.executeCreate({ id: '1', v: 10 });
  assert.deepEqual(s.queryById('1'), { id: '1', v: 10 });
});
test('cqrs update 同步两个模型', () => {
  const s = new CqrsStore<{ id: string; v: number }>();
  s.executeCreate({ id: '1', v: 10 });
  s.executeUpdate('1', { v: 20 });
  assert.equal(s.queryById('1')!.v, 20);
});
test('cqrs delete 移除', () => {
  const s = new CqrsStore<{ id: string; v: number }>();
  s.executeCreate({ id: '1', v: 10 });
  s.executeDelete('1');
  assert.equal(s.queryById('1'), undefined);
});
test('cqrs trace 非空', () => assert.ok(buildTrace().length > 0));
