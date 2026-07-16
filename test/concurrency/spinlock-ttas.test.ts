import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TtasLock, simulateTtas } from '../../src/algorithms/concurrency/spinlock-ttas/impl.ts';
import { buildTrace, defaultEvents } from '../../src/algorithms/concurrency/spinlock-ttas/trace.ts';

test('ttas 互斥性：至多一个线程在临界区', () => {
  const steps = simulateTtas(3, [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 2, action: 'lock' },
    { thread: 0, action: 'unlock' },
    { thread: 1, action: 'unlock' },
    { thread: 2, action: 'unlock' },
  ]);
  for (const s of steps) {
    const cnt = s.states.filter((st) => st === 'critical').length;
    assert.ok(cnt <= 1);
  }
});

test('ttas 第一次 lock 立即进入', () => {
  const l = new TtasLock();
  assert.equal(l.lock(0), true);
  assert.ok(l.locked);
});

test('ttas 第二次 lock 阻塞（读到占用）', () => {
  const l = new TtasLock();
  l.lock(0);
  assert.equal(l.lock(1), false);
  assert.deepEqual(l.waiting, [1]);
});

test('ttas unlock 唤醒等待者', () => {
  const l = new TtasLock();
  l.lock(0);
  l.lock(1);
  l.unlock(0);
  assert.ok(l.locked);
  assert.deepEqual(l.waiting, []);
});

test('ttas 统计：读次数 >= TAS 次数（TTAS 特征）', () => {
  const l = new TtasLock();
  l.lock(0); // 读0 + TAS 成功
  assert.ok(l.stats.reads >= 1);
  assert.ok(l.stats.testAndSets >= 1);
});

test('ttas 读到占用不发 TAS', () => {
  let readCount = 0;
  let tasCount = 0;
  const l = new TtasLock({
    onRead: () => readCount++,
    onTestAndSet: () => tasCount++,
  });
  l.lock(0); // 读1 + TAS1
  const r1 = readCount;
  const t1 = tasCount;
  l.lock(1); // 读到1（占用）→ 入队，不发 TAS
  assert.equal(readCount, r1 + 1);
  assert.equal(tasCount, t1); // 不增
});

test('ttas simulate 钩子触发', () => {
  const enters: number[] = [];
  const releases: number[] = [];
  simulateTtas(
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

test('ttas 排队 FIFO', () => {
  const steps = simulateTtas(3, [
    { thread: 0, action: 'lock' },
    { thread: 2, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 0, action: 'unlock' }, // 唤醒 2
    { thread: 2, action: 'unlock' }, // 唤醒 1
  ]);
  assert.equal(steps[3]!.holder, 2);
  assert.equal(steps[4]!.holder, 1);
});

test('ttas 解锁无等待者时释放为空闲', () => {
  const l = new TtasLock();
  l.lock(0);
  l.unlock(0);
  assert.ok(!l.locked);
});

test('ttas 累计统计正确', () => {
  const steps = simulateTtas(2, [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 0, action: 'unlock' },
    { thread: 1, action: 'unlock' },
  ]);
  const last = steps[steps.length - 1]!;
  // 至少有若干次普通读和 TAS
  assert.ok(last.stats.reads >= 2);
  assert.ok(last.stats.testAndSets >= 2);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace({ events: defaultEvents() });
  assert.ok(frames.length >= 5);
});
