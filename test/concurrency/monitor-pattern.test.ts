import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateMonitor } from '../../src/algorithms/concurrency/monitor-pattern/impl.ts';

test('monitor enter 获取锁', () => {
  const snaps = simulateMonitor(2, [{ thread: 0, action: 'enter' }]);
  assert.equal(snaps[0]!.lockHolder, 0);
  assert.equal(snaps[0]!.phase[0], 'inside');
});

test('monitor exit 释放锁', () => {
  const snaps = simulateMonitor(2, [
    { thread: 0, action: 'enter' },
    { thread: 0, action: 'exit' },
  ]);
  assert.equal(snaps[1]!.lockHolder, -1);
  assert.equal(snaps[1]!.phase[0], 'idle');
});

test('monitor wait 将线程加入条件队列并释放锁', () => {
  const snaps = simulateMonitor(2, [
    { thread: 0, action: 'enter' },
    { thread: 0, action: 'wait', cond: 'notFull' },
  ]);
  assert.deepEqual(snaps[1]!.queues.notFull, [0]);
  assert.equal(snaps[1]!.lockHolder, -1);
  assert.equal(snaps[1]!.phase[0], 'wait:notFull');
});

test('monitor signal 唤醒队首等待者', () => {
  const snaps = simulateMonitor(3, [
    { thread: 0, action: 'wait', cond: 'notEmpty' },
    { thread: 1, action: 'wait', cond: 'notEmpty' },
    { thread: 2, action: 'signal', cond: 'notEmpty' }, // 唤醒 T0
  ]);
  assert.deepEqual(snaps[2]!.queues.notEmpty, [1]); // 只剩 T1
  assert.equal(snaps[2]!.phase[0], 'woken');
});

test('monitor broadcast 唤醒全部', () => {
  const snaps = simulateMonitor(3, [
    { thread: 0, action: 'wait', cond: 'notEmpty' },
    { thread: 1, action: 'wait', cond: 'notEmpty' },
    { thread: 2, action: 'broadcast', cond: 'notEmpty' },
  ]);
  assert.deepEqual(snaps[2]!.queues.notEmpty, []);
  assert.equal(snaps[2]!.phase[0], 'woken');
  assert.equal(snaps[2]!.phase[1], 'woken');
});

test('monitor signal 空队列不报错', () => {
  const snaps = simulateMonitor(1, [{ thread: 0, action: 'signal', cond: 'x' }]);
  assert.deepEqual(snaps[0]!.queues.x, []);
});
