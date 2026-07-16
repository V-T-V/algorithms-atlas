import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventStore } from '../../src/algorithms/design/design-event-sourcing-2/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-event-sourcing-2/trace.ts';

test('event sourcing 重放求状态', () => {
  const es = new EventStore<{ n: number }>({ n: 0 }, (s, e) =>
    e.type === 'add' ? { n: s.n + (e.payload.x as number) } : s,
  );
  es.append('add', { x: 5 });
  es.append('add', { x: 3 });
  es.append('add', { x: 10 });
  assert.equal(es.currentState().n, 18);
});
test('event sourcing 时间旅行', () => {
  const es = new EventStore<{ n: number }>({ n: 0 }, (s, e) =>
    e.type === 'add' ? { n: s.n + (e.payload.x as number) } : s,
  );
  es.append('add', { x: 1 }, 100);
  es.append('add', { x: 2 }, 200);
  es.append('add', { x: 4 }, 300);
  assert.equal(es.stateAt(150).n, 1);
  assert.equal(es.stateAt(250).n, 3);
  assert.equal(es.currentState().n, 7);
});
test('event sourcing trace 非空', () => assert.ok(buildTrace().length > 0));
