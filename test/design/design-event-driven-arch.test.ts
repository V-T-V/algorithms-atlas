import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventBus } from '../../src/algorithms/design/design-event-driven-arch/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-event-driven-arch/trace.ts';
test('eda 订阅与触发', () => {
  const bus = new EventBus();
  const log: number[] = [];
  bus.subscribe('x', (e) => log.push(e.payload));
  bus.emit({ type: 'x', payload: 5 });
  bus.emit({ type: 'y', payload: 9 });
  assert.deepEqual(log, [5]);
});
test('eda trace 非空', () => assert.ok(buildTrace().length > 0));
