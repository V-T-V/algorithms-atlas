// 随机排列生成与校验 · 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fisherYatesShuffle,
  verifyByCounting,
  verifyByFingerprint,
  generateAndVerify,
  makeRng,
} from '../../src/algorithms/randomized/random-permutation-check/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/randomized/random-permutation-check/trace.ts';

test('Fisher-Yates 生成合法排列', () => {
  const arr = fisherYatesShuffle(10, makeRng(42));
  assert.equal(arr.length, 10);
  assert.equal(verifyByCounting(arr), true);
});

test('Fisher-Yates 含所有 [0,n) 元素', () => {
  const arr = fisherYatesShuffle(20, makeRng(7));
  assert.deepEqual(
    [...arr].sort((a, b) => a - b),
    Array.from({ length: 20 }, (_, i) => i),
  );
});

test('Fisher-Yates 同种子可复现', () => {
  const a1 = fisherYatesShuffle(8, makeRng(123));
  const a2 = fisherYatesShuffle(8, makeRng(123));
  assert.deepEqual(a1, a2);
});

test('Fisher-Yates 不同种子通常不同', () => {
  const a1 = fisherYatesShuffle(20, makeRng(1));
  const a2 = fisherYatesShuffle(20, makeRng(2));
  assert.notDeepEqual(a1, a2);
});

test('n=0/1 边界', () => {
  assert.deepEqual(fisherYatesShuffle(0, makeRng(1)), []);
  assert.deepEqual(fisherYatesShuffle(1, makeRng(1)), [0]);
});

test('计数法：合法排列返回 true', () => {
  assert.equal(verifyByCounting([2, 0, 1]), true);
  assert.equal(verifyByCounting([0, 1, 2, 3]), true);
});

test('计数法：含重复返回 false', () => {
  assert.equal(verifyByCounting([0, 1, 1, 3]), false);
});

test('计数法：含越界返回 false', () => {
  assert.equal(verifyByCounting([0, 1, 5]), false); // 5 越界
  assert.equal(verifyByCounting([0, -1, 2]), false);
});

test('指纹法：合法排列返回 true', () => {
  assert.equal(verifyByFingerprint([2, 0, 1]), true);
  assert.equal(verifyByFingerprint([0, 1, 2, 3, 4]), true);
});

test('指纹法：和相同但非排列也常被识破（平方和）', () => {
  // [0,0,3] 和=3 同 [0,1,2]=3，但平方和 0+0+9=9 ≠ 0+1+4=5
  assert.equal(verifyByFingerprint([0, 0, 3]), false);
});

test('generateAndVerify 综合', () => {
  const { permutation, validCount, validFingerprint } = generateAndVerify(15, makeRng(99));
  assert.equal(permutation.length, 15);
  assert.equal(validCount, true);
  assert.equal(validFingerprint, true);
});

test('钩子触发', () => {
  const swaps: Array<[number, number]> = [];
  fisherYatesShuffle(5, makeRng(42), {
    onSwap: (i, j) => swaps.push([i, j]),
  });
  assert.equal(swaps.length, 4); // i=4,3,2,1
});

test('buildTrace 生成至少 4 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
});

test('DEFAULT_INPUT.n=6', () => {
  assert.equal(DEFAULT_INPUT.n, 6);
});
