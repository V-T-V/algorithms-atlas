import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  WsDeque,
  simulateWorkStealing,
} from '../../src/algorithms/concurrency/work-stealing/impl.ts';
import { buildTrace, defaultEvents } from '../../src/algorithms/concurrency/work-stealing/trace.ts';

test('ws deque push/pop LIFO 顺序', () => {
  const d = new WsDeque();
  d.push(1);
  d.push(2);
  d.push(3);
  assert.equal(d.pop(), 3); // LIFO
  assert.equal(d.pop(), 2);
  assert.equal(d.pop(), 1);
  assert.equal(d.pop(), undefined);
});

test('ws deque steal FIFO 顺序（从尾部）', () => {
  const d = new WsDeque();
  d.push(1);
  d.push(2);
  d.push(3);
  assert.equal(d.steal(), 1); // 尾部 = 最早 push 的
  assert.equal(d.steal(), 2);
  assert.equal(d.steal(), 3);
  assert.equal(d.steal(), undefined);
});

test('ws deque size 正确', () => {
  const d = new WsDeque();
  assert.equal(d.size, 0);
  d.push(1);
  d.push(2);
  assert.equal(d.size, 2);
  d.steal();
  assert.equal(d.size, 1);
  d.pop();
  assert.equal(d.size, 0);
});

test('ws simulate push/pop 本地操作', () => {
  const r = simulateWorkStealing(2, [
    { type: 'push', worker: 0, taskId: 1 },
    { type: 'push', worker: 0, taskId: 2 },
    { type: 'pop', worker: 0 },
  ]);
  assert.equal(r.stats.pushes, 2);
  assert.equal(r.stats.pops, 1);
  // 0 号 pop 了 2（LIFO），剩 [1]
  assert.deepEqual(r.deques[0], [1]);
});

test('ws simulate steal 从他人偷', () => {
  const r = simulateWorkStealing(2, [
    { type: 'push', worker: 0, taskId: 10 },
    { type: 'push', worker: 0, taskId: 11 },
    { type: 'steal', worker: 1 }, // 偷 10（尾部）
  ]);
  assert.equal(r.stats.stealSuccesses, 1);
  // worker 0 剩 [11]
  assert.deepEqual(r.deques[0], [11]);
});

test('ws simulate steal 全空时失败', () => {
  const r = simulateWorkStealing(2, [{ type: 'steal', worker: 0 }]);
  assert.equal(r.stats.stealAttempts, 1);
  assert.equal(r.stats.stealSuccesses, 0);
});

test('ws simulate 钩子 onSteal', () => {
  let stoleFrom = -1;
  let success = false;
  simulateWorkStealing(
    2,
    [
      { type: 'push', worker: 1, taskId: 5 },
      { type: 'steal', worker: 0 },
    ],
    {
      onSteal: (_w, victim, ok) => {
        stoleFrom = victim;
        success = ok;
      },
    },
  );
  assert.equal(stoleFrom, 1);
  assert.equal(success, true);
});

test('ws simulate 负载均衡（多次 push 后 steal 均分）', () => {
  const r = simulateWorkStealing(3, [
    { type: 'push', worker: 0, taskId: 1 },
    { type: 'push', worker: 0, taskId: 2 },
    { type: 'push', worker: 0, taskId: 3 },
    { type: 'steal', worker: 1 },
    { type: 'steal', worker: 2 },
  ]);
  // worker 0 剩 1 个，1 和 2 各偷到 1 个（已执行，不入队）
  assert.equal(r.deques[0]!.length, 1);
  assert.equal(r.deques[1]!.length, 0);
  assert.equal(r.deques[2]!.length, 0);
  assert.equal(r.stats.stealSuccesses, 2);
});

test('ws simulate 空事件', () => {
  const r = simulateWorkStealing(2, []);
  assert.equal(r.stats.pushes, 0);
  assert.deepEqual(r.deques, [[], []]);
});

test('ws simulate 不偷自己', () => {
  // worker 0 自己有任务但执行 steal，不应偷自己
  const r = simulateWorkStealing(1, [
    { type: 'push', worker: 0, taskId: 1 },
    { type: 'steal', worker: 0 },
  ]);
  // 只有一个 worker，无处可偷
  assert.equal(r.stats.stealSuccesses, 0);
  assert.deepEqual(r.deques[0], [1]);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace({ events: defaultEvents() });
  assert.ok(frames.length >= 3);
});
