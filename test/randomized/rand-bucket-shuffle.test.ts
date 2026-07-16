import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bucketShuffle,
  makeRng,
} from '../../src/algorithms/randomized/rand-bucket-shuffle/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-bucket-shuffle/trace.ts';

test('rand-bucket-shuffle 是排列', () => {
  const r = bucketShuffle(10, makeRng(1));
  assert.deepEqual(
    [...r].sort((a, b) => a - b),
    Array.from({ length: 10 }, (_, i) => i),
  );
});

test('rand-bucket-shuffle 确定性', () => {
  assert.deepEqual(bucketShuffle(8, makeRng(5)), bucketShuffle(8, makeRng(5)));
});

test('rand-bucket-shuffle n=1', () => {
  assert.deepEqual(bucketShuffle(1, makeRng(1)), [0]);
});

test('rand-bucket-shuffle 分布大致均匀', () => {
  // 多次运行，元素 0 落在各位置应分散
  const counts = new Array(6).fill(0);
  for (let t = 0; t < 600; t++) {
    const r = bucketShuffle(6, makeRng(t));
    counts[r.indexOf(0)]!++;
  }
  for (const c of counts) assert.ok(c > 50 && c < 200, `c=${c}`);
});

test('rand-bucket-shuffle trace', () => {
  assert.ok(buildTrace().length > 2);
});
