import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ChatRoom, ChatUser } from '../../src/algorithms/design/design-mediator/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-mediator/trace.ts';

test('mediator 广播送达除发送者外所有人', () => {
  const room = new ChatRoom();
  const alice = new ChatUser('alice', room);
  const bob = new ChatUser('bob', room);
  const carol = new ChatUser('carol', room);
  alice.send('hi');
  assert.equal(alice.inbox.length, 0);
  assert.equal(bob.inbox.length, 1);
  assert.equal(carol.inbox.length, 1);
});
test('mediator 私信只给指定人', () => {
  const room = new ChatRoom();
  const alice = new ChatUser('alice', room);
  const bob = new ChatUser('bob', room);
  alice.sendTo('bob', 'psst');
  assert.equal(bob.inbox.length, 1);
  assert.equal(alice.inbox.length, 0);
});
test('mediator 私信给不存在的人不送达', () => {
  const room = new ChatRoom();
  const alice = new ChatUser('alice', room);
  alice.sendTo('ghost', 'hello?');
  assert.equal(alice.inbox.length, 0);
});
test('mediator 离开后不再收消息', () => {
  const room = new ChatRoom();
  const alice = new ChatUser('alice', room);
  const bob = new ChatUser('bob', room);
  bob.leave();
  alice.send('broadcast');
  assert.equal(bob.inbox.length, 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
