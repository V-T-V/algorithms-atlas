import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  countSmaller,
  countSmallerBrute,
} from '../../src/algorithms/misc/misc-count-smaller/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/misc-count-smaller/trace.ts';

test('count-smaller [5,2,6,1] = [2,1,1,0]', () => {
  assert.deepEqual(countSmaller([5, 2, 6, 1]), [2, 1, 1, 0]);
});

test('count-smaller [-1,-1] = [0,0]', () => {
  assert.deepEqual(countSmaller([-1, -1]), [0, 0]);
});

test('count-smaller 空输入', () => {
  assert.deepEqual(countSmaller([]), []);
});

test('count-smaller 升序全 0', () => {
  assert.deepEqual(countSmaller([1, 2, 3, 4]), [0, 0, 0, 0]);
});

test('count-smaller 降序', () => {
  assert.deepEqual(countSmaller([4, 3, 2, 1]), [3, 2, 1, 0]);
});

test('count-smaller 归并 == 暴力', () => {
  const cases = [
    [5, 2, 6, 1],
    [3, 1, 4, 1, 5, 9, 2, 6],
    [10, -2, 7, 3, 0],
  ];
  for (const c of cases) {
    assert.deepEqual(countSmaller(c), countSmallerBrute(c));
  }
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
