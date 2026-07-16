import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BatchProcessor, batchItems } from '../../src/algorithms/design/batch-processing/impl.ts';

test('batch 阈值触发 flush', () => {
  const p = new BatchProcessor<number>(3);
  p.add(1);
  p.add(2);
  assert.equal(p.pending, 2);
  p.add(3); // 触发 flush
  assert.equal(p.pending, 0);
  assert.equal(p.stats().batchCount, 1);
});

test('batch 显式 flush 剩余', () => {
  const p = new BatchProcessor<number>(5);
  p.add(1);
  p.add(2);
  p.add(3);
  const size = p.flush();
  assert.equal(size, 3);
  assert.equal(p.stats().batchCount, 1);
});

test('batch 空缓冲 flush 返回 0', () => {
  const p = new BatchProcessor<number>(2);
  assert.equal(p.flush(), 0);
  assert.equal(p.stats().batchCount, 0);
});

test('batch 统计总项数正确', () => {
  const p = new BatchProcessor<number>(2);
  for (let i = 1; i <= 7; i++) p.add(i);
  p.flush();
  const s = p.stats();
  // 7 项，阈值 2：3 批（2,2,2）+ 1 批（1）= 4 批
  assert.equal(s.batchCount, 4);
  assert.equal(s.totalProcessed, 7);
  assert.deepEqual(s.batchSizes, [2, 2, 2, 1]);
});

test('batch onFlush 钩子触发', () => {
  const flushed: number[][] = [];
  const p = new BatchProcessor<number>(2, { onFlush: (b) => flushed.push([...b]) });
  p.add(10);
  p.add(20); // flush
  p.add(30);
  p.flush();
  assert.deepEqual(flushed, [[10, 20], [30]]);
});

test('batchItems 便利函数分批', () => {
  const batches = batchItems([1, 2, 3, 4, 5], 2);
  assert.deepEqual(batches, [[1, 2], [3, 4], [5]]);
});

test('batch 阈值必须为正', () => {
  assert.throws(() => new BatchProcessor<number>(0));
  assert.throws(() => new BatchProcessor<number>(-1));
});

test('batch FIFO 顺序保留', () => {
  const flushed: number[][] = [];
  const p = new BatchProcessor<number>(3, { onFlush: (b) => flushed.push([...b]) });
  p.add(1);
  p.add(2);
  p.add(3);
  p.add(4);
  p.flush();
  assert.deepEqual(flushed, [[1, 2, 3], [4]]);
});
