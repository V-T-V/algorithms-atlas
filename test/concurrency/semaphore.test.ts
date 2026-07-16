import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Semaphore, simulateSemaphore } from '../../src/algorithms/concurrency/semaphore/impl.ts';

test('semaphore acquire 在许可充足时立即成功', () => {
  const sem = new Semaphore(2);
  assert.equal(sem.acquire(0), true);
  assert.equal(sem.acquire(1), true);
  assert.equal(sem.count, 0);
});

test('semaphore acquire 阻塞后 release 唤醒', () => {
  const sem = new Semaphore(1);
  sem.acquire(0); // value 1->0
  // 第二个 acquire 应阻塞入队
  assert.equal(sem.acquire(1), false);
  assert.equal(sem.waiting, 1);
  // release 应唤醒 T1，计数净不变（许可转交）
  const woke = sem.release();
  assert.equal(woke, true);
  assert.equal(sem.count, 0); // 转交：许可数不变
  assert.equal(sem.waiting, 0);
});

test('semaphore release 队列空时计数 +1', () => {
  const sem = new Semaphore(0);
  assert.equal(sem.release(), false); // 无等待者
  assert.equal(sem.count, 1);
});

test('simulateSemaphore 跟踪每步状态', () => {
  const steps = simulateSemaphore(2, [
    { type: 'acquire', threadId: 0 },
    { type: 'acquire', threadId: 1 },
    { type: 'acquire', threadId: 2 }, // 阻塞
    { type: 'release' }, // 唤醒 T2
    { type: 'release' }, // value 0->1
  ]);
  // value 序列：1, 0, 0(block), 0(wake,净不变), 1
  assert.deepEqual(
    steps.map((s) => s.value),
    [1, 0, 0, 0, 1],
  );
  // queueSize 序列：0, 0, 1, 0, 0
  assert.deepEqual(
    steps.map((s) => s.queueSize),
    [0, 0, 1, 0, 0],
  );
});

test('semaphore 钩子被正确触发', () => {
  const acquires: number[] = [];
  const blocks: number[] = [];
  const wakes: number[] = [];
  const releases: number[] = [];
  simulateSemaphore(
    1,
    [
      { type: 'acquire', threadId: 0 },
      { type: 'acquire', threadId: 1 }, // block
      { type: 'release' }, // wake T1
      { type: 'release' }, // value++ (1->2 wait, no... value after wake=0, then +1)
    ],
    {
      onAcquire: (v) => acquires.push(v),
      onBlock: (t) => blocks.push(t),
      onWake: (t) => wakes.push(t),
      onRelease: (v) => releases.push(v),
    },
  );
  assert.deepEqual(acquires, [0]); // T0 成功，value 1->0
  assert.deepEqual(blocks, [1]); // T1 阻塞
  assert.deepEqual(wakes, [1]); // 唤醒 T1
  assert.deepEqual(releases, [1]); // 最后一次 release 计数 0->1
});

test('semaphore 二值信号量退化为互斥锁', () => {
  // 初始 1：最多一个线程持有
  const sem = new Semaphore(1);
  assert.equal(sem.acquire(0), true);
  assert.equal(sem.acquire(1), false); // 互斥
  assert.equal(sem.acquire(2), false);
  assert.equal(sem.waiting, 2);
});
