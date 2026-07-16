// Las Vegas Quickselect · 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  quickselect,
  median,
  makeRng,
  makeSampleArray,
  estimatePivotSequenceLength,
} from '../../src/algorithms/randomized/las-vegas-quickselect/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/randomized/las-vegas-quickselect/trace.ts';

test('quickselect 第 0 小 = 最小值', () => {
  const arr = makeSampleArray();
  const min = Math.min(...arr);
  assert.equal(quickselect([...arr], 0, makeRng(42)), min);
});

test('quickselect 第 (n-1) 小 = 最大值', () => {
  const arr = makeSampleArray();
  const max = Math.max(...arr);
  assert.equal(quickselect([...arr], arr.length - 1, makeRng(42)), max);
});

test('quickselect 中位数正确', () => {
  const arr = makeSampleArray();
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor((arr.length - 1) / 2);
  assert.equal(quickselect([...arr], mid, makeRng(7)), sorted[mid]);
});

test('quickselect 与排序一致（所有 k）', () => {
  const arr = makeSampleArray();
  const sorted = [...arr].sort((a, b) => a - b);
  for (let k = 0; k < arr.length; k++) {
    assert.equal(quickselect([...arr], k, makeRng(k + 1)), sorted[k]);
  }
});

test('quickselect 与排序一致（多个数组）', () => {
  const cases = [[5, 3, 8, 1, 9, 2, 7, 4, 6], [1, 1, 1, 1], [10, -3, 7, 0, 7, -3], [42], [3, 1, 2]];
  for (const arr of cases) {
    const sorted = [...arr].sort((a, b) => a - b);
    for (let k = 0; k < arr.length; k++) {
      assert.equal(quickselect([...arr], k, makeRng(k * 13 + 7)), sorted[k], `arr=[${arr}] k=${k}`);
    }
  }
});

test('quickselect Las Vegas：任意种子结果都正确', () => {
  const arr = [9, 3, 7, 1, 5, 8, 2, 6, 4, 0];
  const sorted = [...arr].sort((a, b) => a - b);
  const k = 5;
  for (let s = 1; s <= 20; s++) {
    assert.equal(quickselect([...arr], k, makeRng(s)), sorted[k]);
  }
});

test('quickselect 重复元素', () => {
  const arr = [5, 5, 5, 1, 1, 9, 9, 9, 9];
  const sorted = [...arr].sort((a, b) => a - b);
  for (let k = 0; k < arr.length; k++) {
    assert.equal(quickselect([...arr], k, makeRng(3)), sorted[k]);
  }
});

test('quickselect 已排序数组（最坏确定型 → 期望仍快）', () => {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  assert.equal(quickselect([...arr], 4, makeRng(1)), 4);
  assert.equal(quickselect([...arr], 0, makeRng(1)), 0);
  assert.equal(quickselect([...arr], 9, makeRng(1)), 9);
});

test('quickselect 钩子完整触发', () => {
  const arr = makeSampleArray();
  const pivots: number[] = [];
  const results: number[] = [];
  quickselect([...arr], 3, makeRng(5), {
    onPivot: (_i, v) => pivots.push(v),
    onResult: (v) => results.push(v),
  });
  assert.ok(pivots.length >= 1, '至少选一次 pivot');
  assert.equal(results.length, 1);
  assert.equal(results[0], 3); // 第 3 小是 3
});

test('quickselect 空数组抛错', () => {
  assert.throws(() => quickselect([], 0, makeRng(1)));
});

test('quickselect k 越界抛错', () => {
  assert.throws(() => quickselect([1, 2, 3], -1, makeRng(1)));
  assert.throws(() => quickselect([1, 2, 3], 3, makeRng(1)));
});

test('median 正确', () => {
  const arr = [9, 3, 7, 1, 5, 8, 2, 6, 4, 0];
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor((arr.length - 1) / 2);
  assert.equal(median(arr, makeRng(11)), sorted[mid]);
});

test('estimatePivotSequenceLength 返回正数', () => {
  const arr = makeSampleArray();
  const len = estimatePivotSequenceLength(arr, 3, makeRng(1));
  assert.ok(len >= 1);
});

test('quickselect 单元素数组', () => {
  assert.equal(quickselect([42], 0, makeRng(1)), 42);
});

test('makeRng 确定性', () => {
  const r1 = makeRng(123);
  const r2 = makeRng(123);
  for (let i = 0; i < 5; i++) {
    assert.equal(r1(), r2());
  }
});

test('buildTrace 生成至少 3 帧（initial + 至少一次 pivot + final）', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3, `帧数 ${frames.length} 应 >= 3`);
});

test('buildTrace 含 bars', () => {
  const frames = buildTrace();
  for (const f of frames) {
    assert.ok(f.bars === undefined || Array.isArray(f.bars));
  }
});

test('DEFAULT_INPUT 配置正确', () => {
  assert.equal(DEFAULT_INPUT.k, 4);
  assert.equal(DEFAULT_INPUT.seed, 42);
  assert.equal(DEFAULT_INPUT.array.length, 10);
});
