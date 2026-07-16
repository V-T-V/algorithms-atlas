import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bucketSelect } from '../../src/algorithms/selection/bucket-select/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/bucket-select/trace.ts';

test('bucket-select 基本选择', () => {
  const arr = [29, 7, 52, 11, 88, 35, 64, 18, 43];
  assert.equal(bucketSelect(arr, 0), 7);
  assert.equal(bucketSelect(arr, 4), 35);
  assert.equal(bucketSelect(arr, arr.length - 1), 88);
});

test('bucket-select 与排序一致（均匀分布）', () => {
  const arr = [29, 7, 52, 11, 88, 35, 64, 18, 43, 96, 3, 77];
  const sorted = [...arr].sort((a, b) => a - b);
  for (let k = 0; k < arr.length; k++) {
    assert.equal(bucketSelect(arr, k), sorted[k], `k=${k}`);
  }
});

test('bucket-select 不修改原数组', () => {
  const input = [5, 1, 3];
  bucketSelect(input, 0);
  assert.deepEqual(input, [5, 1, 3]);
});

test('bucket-select 全等元素', () => {
  const arr = [4, 4, 4, 4, 4];
  assert.equal(bucketSelect(arr, 2), 4);
});

test('bucket-select 越界抛错', () => {
  assert.throws(() => bucketSelect([1, 2, 3], -1));
  assert.throws(() => bucketSelect([1, 2, 3], 3));
});

test('bucket-select 钩子被调用', () => {
  let ranges = 0;
  let bases = 0;
  bucketSelect([29, 7, 52, 11, 88, 35], 2, {
    onRange: () => ranges++,
    onBase: () => bases++,
  });
  assert.ok(ranges >= 1);
  assert.ok(bases >= 1);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux, '终帧应有 aux');
});
