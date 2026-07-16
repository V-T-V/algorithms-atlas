import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kthSymbol } from '../../src/algorithms/recursion/k-th-symbol/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/k-th-symbol/trace.ts';

test('kthSymbol 第 1 行', () => {
  assert.equal(kthSymbol(1, 1), 0);
});

test('kthSymbol LeetCode 样例 (1,1)', () => {
  assert.equal(kthSymbol(1, 1), 0);
});

test('kthSymbol LeetCode 样例 (2,1)', () => {
  // 第2行 = "01"
  assert.equal(kthSymbol(2, 1), 0);
  assert.equal(kthSymbol(2, 2), 1);
});

test('kthSymbol 第 3 行 = "0110"', () => {
  assert.equal(kthSymbol(3, 1), 0);
  assert.equal(kthSymbol(3, 2), 1);
  assert.equal(kthSymbol(3, 3), 1);
  assert.equal(kthSymbol(3, 4), 0);
});

test('kthSymbol 第 4 行 = "01101001"', () => {
  const expected = [0, 1, 1, 0, 1, 0, 0, 1];
  for (let k = 1; k <= 8; k++) {
    assert.equal(kthSymbol(4, k), expected[k - 1], `k=${k}`);
  }
});

test('kthSymbol 与暴力构造一致', () => {
  let row = '0';
  for (let n = 1; n <= 8; n++) {
    for (let k = 1; k <= row.length; k++) {
      assert.equal(kthSymbol(n, k), Number(row[k - 1]), `n=${n},k=${k}`);
    }
    row =
      row +
      row
        .split('')
        .map((c) => (c === '0' ? '1' : '0'))
        .join('');
  }
});

test('kthSymbol 非法输入抛错', () => {
  assert.throws(() => kthSymbol(0, 1));
  assert.throws(() => kthSymbol(2, 0));
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
