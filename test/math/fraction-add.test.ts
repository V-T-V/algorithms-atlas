import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fractionAdd } from '../../src/algorithms/math/fraction-add/impl.ts';

test('fractionAdd 基本求和', () => {
  // 1/2 + 1/3 = 5/6
  assert.deepEqual(
    fractionAdd([
      [1, 2],
      [1, 3],
    ]),
    [5n, 6n],
  );
  // 1/2 + 1/3 + 1/4 + 1/5 = (30+20+15+12)/60 = 77/60
  assert.deepEqual(
    fractionAdd([
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
    ]),
    [77n, 60n],
  );
});

test('fractionAdd 含负数与约分', () => {
  // 1/6 + 1/6 = 1/3
  assert.deepEqual(
    fractionAdd([
      [1, 6],
      [1, 6],
    ]),
    [1n, 3n],
  );
  // 1/2 + (-1/2) = 0/1
  assert.deepEqual(
    fractionAdd([
      [1, 2],
      [-1, 2],
    ]),
    [0n, 1n],
  );
  // -1/4 + 3/4 = 1/2
  assert.deepEqual(
    fractionAdd([
      [-1, 4],
      [3, 4],
    ]),
    [1n, 2n],
  );
});

test('fractionAdd 分母符号归一', () => {
  // 1/(-2) + 1/(-2) = -1
  assert.deepEqual(
    fractionAdd([
      [1, -2],
      [1, -2],
    ]),
    [-1n, 1n],
  );
});

test('fractionAdd 空数组与单项', () => {
  assert.deepEqual(fractionAdd([]), [0n, 1n]);
  assert.deepEqual(fractionAdd([[3, 4]]), [3n, 4n]);
});

test('fractionAdd 错误输入', () => {
  assert.throws(() => fractionAdd([[1, 0]]), RangeError);
});

test('fractionAdd 钩子被调用', () => {
  let adds = 0;
  let results = 0;
  fractionAdd(
    [
      [1, 2],
      [1, 3],
    ],
    {
      onAdd: () => adds++,
      onResult: () => results++,
    },
  );
  assert.equal(adds, 2, '每项累加一次');
  assert.equal(results, 1, 'onResult 恰好一次');
});
