import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ActiveObject } from '../../src/algorithms/design/design-active-object/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-active-object/trace.ts';
test('active object 顺序执行', () => {
  const ao = new ActiveObject();
  ao.schedule(() => ao.pushLog('1'));
  ao.schedule(() => ao.pushLog('2'));
  assert.deepEqual(ao.runSync(), ['1', '2']);
});
test('active-object trace 非空', () => assert.ok(buildTrace().length > 0));
