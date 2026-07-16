import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateRendezvous } from '../../src/algorithms/concurrency/rendezvous-sync/impl.ts';

test('rendezvous 对称到达后双方通过', () => {
  const snaps = simulateRendezvous([
    { thread: 'A', action: 'pre' },
    { thread: 'A', action: 'arrive' },
    { thread: 'B', action: 'pre' },
    { thread: 'B', action: 'arrive' },
    { thread: 'A', action: 'proceed' },
    { thread: 'B', action: 'proceed' },
  ]);
  const last = snaps[snaps.length - 1]!;
  assert.equal(last.phase.A, 'done');
  assert.equal(last.phase.B, 'done');
  assert.equal(last.blocked.A, false);
  assert.equal(last.blocked.B, false);
});

test('rendezvous 先 proceed 而对方未到达则阻塞', () => {
  const snaps = simulateRendezvous([
    { thread: 'A', action: 'pre' },
    { thread: 'A', action: 'proceed' }, // B 未 arrive，A 阻塞
  ]);
  assert.equal(snaps[snaps.length - 1]!.blocked.A, true);
  assert.notEqual(snaps[snaps.length - 1]!.phase.A, 'done');
});

test('rendezvous 阻塞线程被对方 arrive 唤醒', () => {
  const snaps = simulateRendezvous([
    { thread: 'A', action: 'pre' },
    { thread: 'A', action: 'arrive' },
    { thread: 'A', action: 'proceed' }, // B 未到，A 阻塞
    { thread: 'B', action: 'pre' },
    { thread: 'B', action: 'arrive' }, // 唤醒 A
  ]);
  const last = snaps[snaps.length - 1]!;
  assert.equal(last.phase.A, 'done');
  assert.equal(last.blocked.A, false);
});

test('rendezvous arrive 使信号量自增', () => {
  const arrives: Array<'A' | 'B'> = [];
  simulateRendezvous([{ thread: 'A', action: 'arrive' }], {
    onArrive: (t) => arrives.push(t),
  });
  assert.deepEqual(arrives, ['A']);
});

test('rendezvous 无饥饿：任意顺序终能通过', () => {
  // A arrive 在最前，B arrive 在最后，但中途 A proceed 时阻塞，B arrive 唤醒
  const snaps = simulateRendezvous([
    { thread: 'A', action: 'pre' },
    { thread: 'A', action: 'arrive' },
    { thread: 'A', action: 'proceed' }, // 阻塞
    { thread: 'B', action: 'pre' },
    { thread: 'B', action: 'arrive' }, // 唤醒 A
    { thread: 'B', action: 'proceed' }, // B 也通过（aArrived 仍为 1）
  ]);
  const last = snaps[snaps.length - 1]!;
  assert.equal(last.phase.A, 'done');
  assert.equal(last.phase.B, 'done');
});
