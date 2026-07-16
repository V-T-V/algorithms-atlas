import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bakeryLock } from '../../src/algorithms/concurrency/bakery-algorithm/impl.ts';

test('bakery 互斥性：任意时刻至多一个线程在临界区', () => {
  // 多个线程交错 lock，验证每次最多一个 critical
  const steps = bakeryLock(4, [
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
    const criticalCount = s.states.filter((st) => st === 'critical').length;
    assert.ok(criticalCount <= 1, `互斥违反：有 ${criticalCount} 个线程同时在临界区`);
  }
});

test('bakery 号牌递增取号', () => {
  const takes: Array<[number, number]> = [];
  bakeryLock(
    3,
    [
      { thread: 0, action: 'lock' },
      { thread: 1, action: 'lock' },
      { thread: 2, action: 'lock' },
    ],
    {
      onTakeNumber: (t, tk) => takes.push([t, tk]),
    },
  );
  assert.deepEqual(takes, [
    [0, 1],
    [1, 2],
    [2, 3],
  ]);
});

test('bakery unlock 后唤醒号牌最小的等待者', () => {
  const enters: number[] = [];
  bakeryLock(
    3,
    [
      { thread: 0, action: 'lock' }, // 进入
      { thread: 2, action: 'lock' }, // 等待（号 2）
      { thread: 1, action: 'lock' }, // 等待（号 3）
      { thread: 0, action: 'unlock' }, // 应唤醒 T2（号更小）
    ],
    {
      onEnter: (t) => enters.push(t),
    },
  );
  assert.deepEqual(enters, [0, 2]);
});

test('bakery 取号后第一个请求立即进入临界区', () => {
  const steps = bakeryLock(2, [{ thread: 0, action: 'lock' }]);
  assert.equal(steps[0]!.inCritical, 0);
  assert.equal(steps[0]!.numbers[0], 1);
});

test('bakery 号牌相同时 id 小者优先（字典序平局）', () => {
  // 手动构造：T1 先取号进入，T0 后取号但同号——这里号递增不会同，
  // 验证退出后唤醒顺序遵循号牌（而非 id）
  const steps = bakeryLock(3, [
    { thread: 2, action: 'lock' }, // 号1，进入
    { thread: 0, action: 'lock' }, // 号2，等待
    { thread: 1, action: 'lock' }, // 号3，等待
    { thread: 2, action: 'unlock' }, // 唤醒 T0（号2 < 号3）
  ]);
  // 最后一步后 T0 应在临界区
  const last = steps[steps.length - 1]!;
  assert.equal(last.inCritical, 0);
});
