import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BloomFilter, bloomFilter } from '../../src/algorithms/ds/bloom-filter/impl.ts';
import { buildTrace } from '../../src/algorithms/ds/bloom-filter/trace.ts';

test('bloom-filter 已加入元素必「可能在」（无假阴性）', () => {
  const bf = new BloomFilter(64, 4);
  for (const k of ['apple', 'banana', 'cherry']) bf.add(k);
  assert.equal(bf.contains('apple'), true);
  assert.equal(bf.contains('banana'), true);
  assert.equal(bf.contains('cherry'), true);
});

test('bloom-filter 便利函数', () => {
  const bf = bloomFilter(64, 4, ['x', 'y', 'z']);
  assert.equal(bf.contains('x'), true);
  assert.equal(bf.contains('y'), true);
  assert.equal(bf.count, 3);
});

test('bloom-filter 未加入元素大多返回 false（演示）', () => {
  // 用较大位数组降低假阳性，使未加入元素大概率判为 false
  const bf = new BloomFilter(1000, 5);
  for (const k of ['cat', 'dog', 'fish']) bf.add(k);
  // 已加入必 true
  assert.equal(bf.contains('cat'), true);
  // 未加入：在低位数下可能假阳，这里测一批统计假阳率
  let fp = 0;
  const total = 200;
  for (let i = 0; i < total; i++) {
    if (bf.contains(`absent${i}`)) fp++;
  }
  // 假阳率应明显小于 50%（位数组足够稀疏）
  assert.ok(fp / total < 0.5, `假阳率 ${fp}/${total} 过高`);
});

test('bloom-filter 位数组只增不减', () => {
  const bf = new BloomFilter(16, 2);
  bf.add('a');
  const before = bf.bitsSet;
  bf.add('a'); // 重复加，位数不变
  assert.equal(bf.bitsSet, before);
  assert.equal(bf.count, 2); // add 计数仍 +1
});

test('bloom-filter 双哈希确定性（同 key 同位）', () => {
  const bf1 = new BloomFilter(64, 3);
  const bf2 = new BloomFilter(64, 3);
  bf1.add('same');
  bf2.add('same');
  assert.deepEqual(bf1.toArray(), bf2.toArray());
});

test('bloom-filter estimateFalsePositiveRate 递增', () => {
  const bf = new BloomFilter(100, 3);
  const p0 = bf.estimateFalsePositiveRate(0);
  for (let i = 0; i < 20; i++) bf.add(`k${i}`);
  const p1 = bf.estimateFalsePositiveRate(); // 用 count
  assert.ok(p1 > p0, '加入越多假阳性率越高');
});

test('bloom-filter 钩子被调用', () => {
  let hashes = 0;
  let setBits = 0;
  let addCalls = 0;
  let results = 0;
  const bf = new BloomFilter(32, 3);
  bf.add('a', {
    onHash: () => hashes++,
    onSetBit: () => setBits++,
    onAdd: () => addCalls++,
  });
  bf.contains('a', { onResult: () => results++ });
  assert.equal(hashes, 3); // k=3
  assert.equal(setBits, 3);
  assert.equal(addCalls, 1);
  assert.equal(results, 1);
});

test('bloom-filter 查询发现 0 位立即返回 false', () => {
  const bf = new BloomFilter(64, 4);
  bf.add('present');
  // 未加入的 'absent' 必在某位为 0 → false
  assert.equal(bf.contains('definitely-absent-xyz'), false);
});

test('bloom-filter buildTrace 产出帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars!.every((b) => b.role === 'final'));
});
