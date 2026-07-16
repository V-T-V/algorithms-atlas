import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PriorityQueue,
  priorityQueue,
  MAX_HEAP,
  type PriorityQueueHooks,
} from '../../src/algorithms/ds/priority-queue/impl.ts';
import { buildTrace } from '../../src/algorithms/ds/priority-queue/trace.ts';
import { meta } from '../../src/algorithms/ds/priority-queue/meta.ts';

test('priority-queue 最小堆 pop 升序', () => {
  const pq = new PriorityQueue();
  pq.buildHeap([5, 2, 8, 1, 9, 3, 7, 4, 6]);
  const out: number[] = [];
  while (!pq.isEmpty()) out.push(pq.pop()!);
  assert.deepEqual(out, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('priority-queue 最大堆 pop 降序', () => {
  const pq = new PriorityQueue(MAX_HEAP);
  pq.buildHeap([5, 2, 8, 1, 9, 3, 7, 4, 6]);
  const out: number[] = [];
  while (!pq.isEmpty()) out.push(pq.pop()!);
  assert.deepEqual(out, [9, 8, 7, 6, 5, 4, 3, 2, 1]);
});

test('priority-queue push 维持堆序', () => {
  const pq = new PriorityQueue();
  for (const v of [5, 2, 8, 1, 9]) pq.push(v);
  assert.equal(pq.peek(), 1, '最小堆顶应是最小值');
  pq.push(0);
  assert.equal(pq.peek(), 0);
});

test('priority-queue 空堆 pop 返回 undefined', () => {
  const pq = new PriorityQueue();
  assert.equal(pq.pop(), undefined);
  assert.equal(pq.peek(), undefined);
  assert.ok(pq.isEmpty());
});

test('priority-queue 堆性质（父 ≤ 子，最小堆）', () => {
  const pq = new PriorityQueue();
  pq.buildHeap([9, 4, 7, 1, 5, 3, 8, 2, 6]);
  const a = pq.toArray();
  for (let i = 0; i < a.length; i++) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < a.length) assert.ok(a[i]! <= a[l]!, `父 ${a[i]} 应 ≤ 左子 ${a[l]}`);
    if (r < a.length) assert.ok(a[i]! <= a[r]!, `父 ${a[i]} 应 ≤ 右子 ${a[r]}`);
  }
});

test('priority-queue 便利函数', () => {
  const { heap, popped } = priorityQueue([5, 2, 8, 1, 9], undefined, {}, { extract: 3 });
  assert.deepEqual(popped, [1, 2, 5]);
  assert.equal(heap.length, 2);
});

test('priority-queue 钩子被调用', () => {
  let compares = 0;
  let swaps = 0;
  let extracts = 0;
  const hooks: PriorityQueueHooks = {
    onCompare: () => compares++,
    onSwap: () => swaps++,
    onExtractDone: () => extracts++,
  };
  const pq = new PriorityQueue();
  pq.buildHeap([5, 2, 8, 1, 9], hooks);
  pq.pop(hooks);
  assert.ok(compares > 0, '应有比较');
  assert.ok(swaps > 0, '应有交换');
  assert.equal(extracts, 1);
});

test('priority-queue trace 末帧为 final', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 1);
  const last = frames[frames.length - 1]!;
  assert.ok(last.array, '末帧应有数组');
  assert.ok(last.aux, '末帧应有 aux');
});

test('priority-queue meta 信息真实', () => {
  assert.equal(meta.id, 'priority-queue');
  assert.equal(meta.categoryId, 'ds');
  assert.ok(!meta.summary.zh.includes('待补充'));
  assert.ok(!meta.tags.includes('todo'));
  assert.equal(meta.complexity.time, 'O(log n)');
});
