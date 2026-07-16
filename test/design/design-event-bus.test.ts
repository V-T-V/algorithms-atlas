import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventBus } from '../../src/algorithms/design/design-event-bus/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-event-bus/trace.ts';

test('event bus emit 触发监听', () => {
  const bus = new EventBus();
  const seen: unknown[] = [];
  bus.on('e', (p) => seen.push(p));
  bus.emit('e', 1);
  bus.emit('e', 2);
  assert.deepEqual(seen, [1, 2]);
});
test('event bus off 取消', () => {
  const bus = new EventBus();
  const fn = (p: unknown) => {
    void p;
  };
  bus.on('e', fn);
  bus.off('e', fn);
  let count = 0;
  bus.on('e', () => count++);
  bus.emit('e', null);
  assert.equal(count, 1);
});
test('event bus trace 非空', () => assert.ok(buildTrace().length > 0));
