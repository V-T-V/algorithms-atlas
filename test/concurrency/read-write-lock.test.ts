import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateReadWriteLock } from '../../src/algorithms/concurrency/read-write-lock/impl.ts';
import {
  buildTrace,
  defaultEvents,
} from '../../src/algorithms/concurrency/read-write-lock/trace.ts';

test('rwlock 多读者可并发', () => {
  const steps = simulateReadWriteLock(2, [
    { thread: 0, action: 'readLock' },
    { thread: 1, action: 'readLock' },
  ]);
  assert.equal(steps[0]!.activeReaders, 1);
  assert.equal(steps[1]!.activeReaders, 2);
  assert.equal(steps[1]!.states[0], 'reading');
  assert.equal(steps[1]!.states[1], 'reading');
});

test('rwlock 写者与读者互斥', () => {
  const steps = simulateReadWriteLock(2, [
    { thread: 0, action: 'writeLock' },
    { thread: 1, action: 'readLock' }, // 阻塞
  ]);
  assert.equal(steps[0]!.writerHolder, 0);
  assert.equal(steps[1]!.states[1], 'waiting-read');
});

test('rwlock 写者离开后唤醒读等待', () => {
  const steps = simulateReadWriteLock(2, [
    { thread: 0, action: 'writeLock' },
    { thread: 1, action: 'readLock' }, // 阻塞
    { thread: 0, action: 'writeUnlock' }, // 唤醒 1
  ]);
  assert.equal(steps[2]!.states[1], 'reading');
  assert.equal(steps[2]!.activeReaders, 1);
});

test('rwlock 读者优先：有写等待时新读者仍可进入', () => {
  const steps = simulateReadWriteLock(3, [
    { thread: 0, action: 'readLock' },
    { thread: 1, action: 'writeLock' }, // 写等待
    { thread: 2, action: 'readLock' }, // 仍可进入（读者优先）
  ]);
  assert.equal(steps[2]!.states[2], 'reading');
  assert.equal(steps[2]!.activeReaders, 2);
});

test('rwlock 读者全离开后才唤醒写者', () => {
  const steps = simulateReadWriteLock(3, [
    { thread: 0, action: 'readLock' },
    { thread: 1, action: 'readLock' },
    { thread: 2, action: 'writeLock' }, // 写等待
    { thread: 0, action: 'readUnlock' }, // 还有 1 个读者，写者继续等
  ]);
  assert.equal(steps[3]!.states[2], 'waiting-write');
  assert.equal(steps[3]!.activeReaders, 1);
});

test('rwlock 读者全离开后写者进入', () => {
  const steps = simulateReadWriteLock(3, [
    { thread: 0, action: 'readLock' },
    { thread: 1, action: 'readLock' },
    { thread: 2, action: 'writeLock' }, // 写等待
    { thread: 0, action: 'readUnlock' },
    { thread: 1, action: 'readUnlock' }, // 全离开 → 写者进入
  ]);
  assert.equal(steps[4]!.states[2], 'writing');
  assert.equal(steps[4]!.writerHolder, 2);
});

test('rwlock 写写互斥', () => {
  const steps = simulateReadWriteLock(2, [
    { thread: 0, action: 'writeLock' },
    { thread: 1, action: 'writeLock' }, // 阻塞
  ]);
  assert.equal(steps[1]!.states[1], 'waiting-write');
});

test('rwlock 钩子触发', () => {
  const enters: number[] = [];
  const blocks: number[] = [];
  simulateReadWriteLock(
    2,
    [
      { thread: 0, action: 'writeLock' },
      { thread: 1, action: 'readLock' },
    ],
    {
      onWriterEnter: (t) => enters.push(t),
      onReaderBlock: (t) => blocks.push(t),
    },
  );
  assert.deepEqual(enters, [0]);
  assert.deepEqual(blocks, [1]);
});

test('rwlock 最大并发读者数', () => {
  const steps = simulateReadWriteLock(4, [
    { thread: 0, action: 'readLock' },
    { thread: 1, action: 'readLock' },
    { thread: 2, action: 'readLock' },
  ]);
  const maxReaders = Math.max(...steps.map((s) => s.activeReaders));
  assert.equal(maxReaders, 3);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace({ events: defaultEvents() });
  assert.ok(frames.length >= 5);
});
