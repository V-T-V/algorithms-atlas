import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MinHash,
  estimateJaccard,
  exactJaccard,
  hashWithSeed,
} from '../../src/algorithms/hashing/min-hash/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/min-hash/trace.ts';

test('min-hash 完全相同集合估计 ≈ 1', () => {
  const set = ['a', 'b', 'c', 'd', 'e'];
  const est = estimateJaccard(set, set, 128);
  assert.ok(est > 0.95, `相同集合估计 ${est} 应接近 1`);
});

test('min-hash 完全不相交集合估计 ≈ 0', () => {
  const a = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const b = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const est = estimateJaccard(a, b, 256);
  assert.ok(est < 0.15, `不相交集合估计 ${est} 应接近 0`);
});

test('min-hash 估计接近真实 Jaccard', () => {
  const a = ['x', 'y', 'z', 'w', 'a', 'b', 'c', 'd', 'e'];
  const b = ['x', 'y', 'z', 'w', 'p', 'q', 'r', 's', 't'];
  const est = estimateJaccard(a, b, 256);
  const real = exactJaccard(a, b);
  assert.ok(Math.abs(est - real) < 0.15, `估计 ${est} 偏离真实 ${real} 过多`);
});

test('min-hash exactJaccard 正确', () => {
  assert.equal(exactJaccard(['a', 'b', 'c'], ['b', 'c', 'd']), 2 / 4);
  assert.equal(exactJaccard(['a'], ['a']), 1);
  assert.equal(exactJaccard(['a'], ['b']), 0);
  assert.equal(exactJaccard([], []), 0);
});

test('min-hash jaccardEstimate 长度不同抛错', () => {
  assert.throws(() => MinHash.jaccardEstimate([1, 2], [1, 2, 3]));
});

test('min-hash 签名长度 = k', () => {
  const mh = new MinHash(64);
  mh.addAll(['a', 'b', 'c']);
  assert.equal(mh.signature.length, 64);
});

test('min-hash 单元素集合签名 = 该元素在各哈希的值', () => {
  const mh = new MinHash(8);
  mh.addAll(['solo']);
  for (let i = 0; i < 8; i++) {
    assert.equal(mh.signature[i], hashWithSeed(mh.seeds[i]!, 'solo'));
  }
});

test('min-hash 加更多元素只可能减小签名', () => {
  const mh = new MinHash(16);
  mh.addAll(['a']);
  const sig1 = [...mh.signature];
  mh.addAll(['b', 'c', 'd', 'e', 'f']);
  for (let i = 0; i < 16; i++) {
    assert.ok(mh.signature[i]! <= sig1[i]!, `签名应单调不增`);
  }
});

test('min-hash k 越界抛错', () => {
  assert.throws(() => new MinHash(0));
});

test('min-hash 钩子 onSignature 被调用', () => {
  const mh = new MinHash(8);
  let called = false;
  mh.addAll(['a']);
  mh.finalize('X', { onSignature: () => (called = true) });
  assert.equal(called, true);
});

test('min-hash hashWithSeed 确定性', () => {
  assert.equal(hashWithSeed(1, 'abc'), hashWithSeed(1, 'abc'));
  assert.notEqual(hashWithSeed(1, 'abc'), hashWithSeed(2, 'abc'));
});

test('buildTrace 含 aux，末帧含估计 Jaccard', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const est = last.aux!.find((e) => e.label === '估计 Jaccard');
  assert.ok(est, '末帧应含估计 Jaccard');
  assert.ok(Number(est!.value) >= 0 && Number(est!.value) <= 1);
});
