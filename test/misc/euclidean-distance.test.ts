import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  euclideanDistance,
  squaredDistance,
} from '../../src/algorithms/misc/euclidean-distance/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/euclidean-distance/trace.ts';

test('euclidean-distance 二维勾股定理', () => {
  // (3,4) 直角三角形斜边 = 5
  assert.equal(euclideanDistance([0, 0], [3, 4]), 5);
  assert.equal(euclideanDistance([1, 2], [4, 6]), 5);
});

test('euclidean-distance 一维', () => {
  assert.equal(euclideanDistance([3], [7]), 4);
  assert.equal(euclideanDistance([-2], [3]), 5);
});

test('euclidean-distance 三维', () => {
  // (1,2,2) → (0,0,0) = √(1+4+4) = 3
  assert.equal(euclideanDistance([1, 2, 2], [0, 0, 0]), 3);
});

test('euclidean-distance 同点距离为 0', () => {
  assert.equal(euclideanDistance([5, 5, 5], [5, 5, 5]), 0);
  assert.equal(euclideanDistance([], []), 0);
});

test('euclidean-distance 维度不匹配抛错', () => {
  assert.throws(() => euclideanDistance([1, 2], [1, 2, 3]));
});

test('squaredDistance 与平方一致', () => {
  assert.equal(squaredDistance([0, 0], [3, 4]), 25);
  assert.equal(squaredDistance([1, 2, 3], [1, 2, 3]), 0);
});

test('euclidean-distance 对称性', () => {
  const d1 = euclideanDistance([1, 5, 2], [8, 3, 9]);
  const d2 = euclideanDistance([8, 3, 9], [1, 5, 2]);
  assert.equal(d1, d2);
});

test('euclidean-distance 钩子被调用', () => {
  const dims: number[] = [];
  let sums = 0;
  let results = 0;
  euclideanDistance([1, 2, 3], [4, 6, 3], {
    onDimension: (k) => dims.push(k),
    onSum: () => sums++,
    onResult: () => results++,
  });
  assert.deepEqual(dims, [0, 1, 2]);
  assert.equal(sums, 1);
  assert.equal(results, 1);
});

test('euclidean-distance 钩子内容正确', () => {
  let lastSum = -1;
  let result = -1;
  euclideanDistance([0, 0], [3, 4], {
    onSum: (s) => (lastSum = s),
    onResult: (d) => (result = d),
  });
  assert.equal(lastSum, 25); // 9 + 16
  assert.equal(result, 5);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 4);
  // 终帧 aux 含距离
  const last = frames[frames.length - 1]!;
  const dist = last.aux!.find((e) => e.label.startsWith('距离'));
  assert.ok(dist, '终帧应有距离条目');
  assert.ok(dist!.value.includes('5.0000'));
});

test('buildTrace 二维情形有 graph', () => {
  const frames = buildTrace({ a: [0, 0], b: [3, 4] });
  for (const f of frames) assert.ok(f.graph, '二维每帧应有 graph');
});
