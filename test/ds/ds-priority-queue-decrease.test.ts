import { test } from 'node:test';
import assert from 'node:assert/strict';
import { IndexedMinHeap } from '../../src/algorithms/ds/ds-priority-queue-decrease/impl.ts';

test('IndexedMinHeap 基本 push/pop', () => {
  const h = new IndexedMinHeap();
  h.push(0, 50);
  h.push(1, 30);
  h.push(2, 40);
  h.push(3, 10);
  const first = h.pop();
  assert.deepEqual(first, { id: 3, prio: 10 });
  const second = h.pop();
  assert.deepEqual(second, { id: 1, prio: 30 });
});

test('IndexedMinHeap peek 不删', () => {
  const h = new IndexedMinHeap();
  h.push(0, 5);
  assert.equal(h.peek()?.id, 0);
  assert.equal(h.size, 1);
});

test('IndexedMinHeap 空堆 pop', () => {
  const h = new IndexedMinHeap();
  assert.equal(h.pop(), undefined);
  assert.equal(h.peek(), undefined);
});

test('decreaseKey 调整后顺序正确', () => {
  const h = new IndexedMinHeap();
  h.push(0, 50);
  h.push(1, 30);
  h.push(2, 40);
  h.decreaseKey(0, 5); // id=0 现在最小
  assert.equal(h.pop()?.id, 0);
  assert.equal(h.pop()?.id, 1);
  assert.equal(h.pop()?.id, 2);
});

test('decreaseKey 拒绝增键', () => {
  const h = new IndexedMinHeap();
  h.push(0, 5);
  assert.throws(() => h.decreaseKey(0, 100));
});

test('decreaseKey 重复', () => {
  const h = new IndexedMinHeap();
  h.push(0, 100);
  h.decreaseKey(0, 50);
  h.decreaseKey(0, 20);
  h.decreaseKey(0, 1);
  assert.equal(h.pop()?.prio, 1);
});

test('has/getPrio', () => {
  const h = new IndexedMinHeap();
  h.push(7, 42);
  assert.equal(h.has(7), true);
  assert.equal(h.has(8), false);
  assert.equal(h.getPrio(7), 42);
  assert.equal(h.getPrio(8), undefined);
});

test('push 重复 id 抛错', () => {
  const h = new IndexedMinHeap();
  h.push(0, 1);
  assert.throws(() => h.push(0, 2));
});

test('IndexedMinHeap 升序弹出', () => {
  const h = new IndexedMinHeap();
  const prios = [5, 3, 8, 1, 9, 2, 7, 4, 6];
  prios.forEach((p, i) => h.push(i, p));
  const out: number[] = [];
  while (h.size > 0) out.push(h.pop()!.prio);
  assert.deepEqual(
    out,
    [...prios].sort((a, b) => a - b),
  );
});

test('Dijkstra 风格场景', () => {
  // 模拟 Dijkstra：decreaseKey 把已存在节点的距离更新
  const h = new IndexedMinHeap();
  h.push(1, 0); // 起点
  h.push(2, Infinity);
  h.push(3, Infinity);
  h.decreaseKey(2, 4);
  h.decreaseKey(3, 2);
  assert.equal(h.pop()?.id, 1); // dist 0
  assert.equal(h.pop()?.id, 3); // dist 2
  assert.equal(h.pop()?.id, 2); // dist 4
});
