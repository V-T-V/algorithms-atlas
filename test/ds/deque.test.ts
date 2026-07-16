import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Deque, deque, type DequeHooks } from '../../src/algorithms/ds/deque/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/ds/deque/trace.ts';
import { meta } from '../../src/algorithms/ds/deque/meta.ts';

test('deque 基本入队/出队', () => {
  const q = new Deque(8);
  assert.ok(q.isEmpty());
  q.pushBack(1);
  q.pushBack(2);
  q.pushFront(0);
  assert.deepEqual(q.toSequence(), [0, 1, 2]);
  assert.equal(q.peekFront(), 0);
  assert.equal(q.peekBack(), 2);
  assert.equal(q.popFront(), 0);
  assert.equal(q.popBack(), 2);
  assert.deepEqual(q.toSequence(), [1]);
});

test('deque 环绕正确', () => {
  const q = new Deque(4);
  q.pushBack(1);
  q.pushBack(2);
  q.pushBack(3);
  q.pushBack(4);
  assert.ok(q.isFull());
  assert.equal(q.pushBack(5), false, '满应拒绝');
  q.popFront(); // 移除 1
  q.popFront(); // 移除 2
  q.pushBack(5);
  q.pushBack(6);
  assert.deepEqual(q.toSequence(), [3, 4, 5, 6]);
});

test('deque 可作栈（pushBack+popBack）', () => {
  const q = new Deque(8);
  q.pushBack(1);
  q.pushBack(2);
  q.pushBack(3);
  assert.equal(q.popBack(), 3);
  assert.equal(q.popBack(), 2);
  assert.equal(q.popBack(), 1);
  assert.ok(q.isEmpty());
});

test('deque 可作队列（pushBack+popFront）', () => {
  const q = new Deque(8);
  q.pushBack(1);
  q.pushBack(2);
  q.pushBack(3);
  assert.equal(q.popFront(), 1);
  assert.equal(q.popFront(), 2);
  assert.equal(q.popFront(), 3);
});

test('deque 空队出队返回 undefined', () => {
  const q = new Deque(4);
  assert.equal(q.popFront(), undefined);
  assert.equal(q.popBack(), undefined);
  assert.equal(q.peekFront(), undefined);
  assert.equal(q.peekBack(), undefined);
});

test('deque 便利函数与钩子', () => {
  let pushes = 0;
  let pops = 0;
  const hooks: DequeHooks = {
    onPushFront: () => pushes++,
    onPushBack: () => pushes++,
    onPopFront: () => pops++,
    onPopBack: () => pops++,
  };
  const q = deque(8, DEFAULT_INPUT.ops, hooks);
  assert.ok(pushes > 0, '应有入队');
  assert.ok(pops > 0, '应有出队');
  assert.ok(q.size > 0);
});

test('deque trace 末帧为 final', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 1);
  const last = frames[frames.length - 1]!;
  assert.ok(last.array, '末帧应有数组');
  assert.ok(last.aux, '末帧应有 aux');
});

test('deque meta 信息真实', () => {
  assert.equal(meta.id, 'deque');
  assert.equal(meta.categoryId, 'ds');
  assert.ok(!meta.summary.zh.includes('待补充'));
  assert.ok(!meta.tags.includes('todo'));
  assert.equal(meta.complexity.time, 'O(1)');
});
