import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bucketSort, type BucketSortHooks } from '../../src/algorithms/sorting/bucket-sort/impl.ts';

function isSorted(a: number[]): boolean {
  for (let i = 1; i < a.length; i++) if (a[i - 1]! > a[i]!) return false;
  return true;
}

test('bucket-sort 边界情况', () => {
  assert.deepEqual(bucketSort([]), []);
  assert.deepEqual(bucketSort([1]), [1]);
});

test('bucket-sort 结果有序', () => {
  const inputs: number[][] = [
    [5, 2, 8, 1, 9, 3, 7, 4, 6],
    [29, 10, 14, 37, 13, 25, 41, 8, 22, 33, 19],
    [3, 3, 3, 3],
    [100],
    [50, 50, 50, 1, 1, 1, 99, 99],
    [0, 0, 0],
  ];
  for (const input of inputs) {
    const out = bucketSort(input);
    assert.ok(isSorted(out), `结果应有序：[${out.join(',')}]`);
    // 元素一致（多重集）
    assert.deepEqual(
      [...out].sort((a, b) => a - b),
      [...input].sort((a, b) => a - b),
    );
  }
});

test('bucket-sort 稳定性（同值保持相对顺序）', () => {
  // 对象相等意义下的稳定：相同值之间顺序不变。这里用「带 id 的偶数」难以直接测，
  // 改为验证：对已排序输入排序后完全一致（包含重复值）
  const input = [1, 1, 2, 2, 3, 3, 3];
  const out = bucketSort(input);
  assert.deepEqual(out, [1, 1, 2, 2, 3, 3, 3]);
});

test('bucket-sort 与 Array.sort 结果一致', () => {
  const input = [29, 10, 14, 37, 13, 25, 41, 8, 22, 33, 19];
  const expected = [...input].sort((a, b) => a - b);
  assert.deepEqual(bucketSort(input), expected);
});

test('bucket-sort 指定桶数', () => {
  const out = bucketSort([5, 2, 8, 1, 9, 3], 3);
  assert.deepEqual(out, [1, 2, 3, 5, 8, 9]);
});

test('bucket-sort 已排序输入保持有序', () => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  assert.deepEqual(bucketSort(input), input);
});

test('bucket-sort 钩子被调用', () => {
  let setups = 0;
  let dispatches = 0;
  let sortBuckets = 0;
  let collects = 0;
  const hooks: BucketSortHooks = {
    onSetup: () => setups++,
    onDispatch: () => dispatches++,
    onSortBuckets: () => sortBuckets++,
    onCollect: () => collects++,
  };
  bucketSort([29, 10, 14, 37, 13], undefined, hooks);
  assert.equal(setups, 1);
  assert.equal(dispatches, 5);
  assert.equal(sortBuckets, 1);
  assert.ok(collects >= 1, `应至少 collect 1 次，实际 ${collects}`);
});

test('bucket-sort 分桶钩子给出合法桶号', () => {
  const bucketCount = 4;
  let maxVal = -Infinity;
  const seenDispatches: Array<{ v: number; b: number }> = [];
  bucketSort([5, 2, 8, 1, 9], bucketCount, {
    onSetup: (_b, mv) => {
      maxVal = mv;
    },
    onDispatch: (v, b) => {
      seenDispatches.push({ v, b });
    },
  });
  assert.ok(maxVal > -Infinity);
  for (const { v, b } of seenDispatches) {
    assert.ok(b >= 0 && b < bucketCount, `桶号 ${b} 越界`);
    assert.ok(v >= 0 && v <= maxVal);
  }
});
