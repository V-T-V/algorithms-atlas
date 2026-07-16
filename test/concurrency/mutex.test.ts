import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Mutex, simulateMutex } from '../../src/algorithms/concurrency/mutex/impl.ts';
import { buildTrace, defaultEvents } from '../../src/algorithms/concurrency/mutex/trace.ts';

test('mutex 互斥性：任意时刻至多一个线程在临界区', () => {
  const steps = simulateMutex(4, [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 2, action: 'lock' },
    { thread: 3, action: 'lock' },
    { thread: 0, action: 'unlock' },
    { thread: 1, action: 'unlock' },
    { thread: 2, action: 'unlock' },
    { thread: 3, action: 'unlock' },
  ]);
  for (const s of steps) {
    const cnt = s.states.filter((st) => st === 'critical').length;
    assert.ok(cnt <= 1, `互斥违反：${cnt} 个线程同时在临界区`);
  }
});

test('mutex TestAndSet 第一次返回 0（成功）', () => {
  const m = new Mutex();
  assert.equal(m.testAndSet(0), 0);
  assert.ok(m.locked);
});

test('mutex TestAndSet 占用后返回 1（失败）', () => {
  const m = new Mutex();
  m.testAndSet(0);
  assert.equal(m.testAndSet(1), 1);
});

test('mutex lock 成功进入，再次 lock 阻塞', () => {
  const m = new Mutex();
  assert.equal(m.lock(0), true);
  assert.equal(m.lock(1), false);
  assert.deepEqual(m.waiting, [1]);
});

test('mutex unlock 后唤醒等待者', () => {
  const m = new Mutex();
  m.lock(0);
  m.lock(1); // 阻塞入队
  m.unlock(0);
  // 1 应被唤醒并持有锁
  assert.ok(m.locked);
  assert.deepEqual(m.waiting, []);
});

test('mutex unlock 无等待者时释放为空闲', () => {
  const m = new Mutex();
  m.lock(0);
  m.unlock(0);
  assert.ok(!m.locked);
});

test('mutex simulate 钩子 onEnter/onRelease', () => {
  const enters: number[] = [];
  const releases: number[] = [];
  simulateMutex(
    2,
    [
      { thread: 0, action: 'lock' },
      { thread: 0, action: 'unlock' },
    ],
    {
      onEnter: (t) => enters.push(t),
      onRelease: (t) => releases.push(t),
    },
  );
  assert.deepEqual(enters, [0]);
  assert.deepEqual(releases, [0]);
});

test('mutex 多线程排队顺序（FIFO）', () => {
  const steps = simulateMutex(3, [
    { thread: 0, action: 'lock' },
    { thread: 2, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 0, action: 'unlock' }, // 唤醒 2
    { thread: 2, action: 'unlock' }, // 唤醒 1
  ]);
  // unlock 0 后 holder = 2
  const s4 = steps[3]!;
  assert.equal(s4.holder, 2);
  // unlock 2 后 holder = 1
  const s5 = steps[4]!;
  assert.equal(s5.holder, 1);
});

test('mutex 第一个 lock 立即进入', () => {
  const steps = simulateMutex(2, [{ thread: 1, action: 'lock' }]);
  assert.equal(steps[0]!.holder, 1);
  assert.equal(steps[0]!.states[1], 'critical');
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace({ events: defaultEvents() });
  assert.ok(frames.length >= 5);
  const last = frames[frames.length - 1]!;
  assert.ok(last.note!.zh.includes('互斥'));
});
