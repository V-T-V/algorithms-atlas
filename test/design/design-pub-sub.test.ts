import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PubSub } from '../../src/algorithms/design/design-pub-sub/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-pub-sub/trace.ts';

test('pubsub 多订阅者都收到', () => {
  const ps = new PubSub();
  const got: number[] = [];
  ps.subscribe('t', () => got.push(1));
  ps.subscribe('t', () => got.push(2));
  ps.publish('t', 'x');
  assert.deepEqual(got, [1, 2]);
});
test('pubsub unsubscribe 后不收到', () => {
  const ps = new PubSub();
  let count = 0;
  const id = ps.subscribe('t', () => count++);
  ps.publish('t', null);
  ps.unsubscribe('t', id);
  ps.publish('t', null);
  assert.equal(count, 1);
});
test('pubsub trace 非空', () => assert.ok(buildTrace().length > 0));
