import { test } from 'node:test';
import assert from 'node:assert/strict';
import { grayCode, toGray, fromGray } from '../../src/algorithms/bitwise/gray-code/impl.ts';

test('grayCode 基本', () => {
  assert.deepEqual(grayCode(0), [0]);
  assert.deepEqual(grayCode(1), [0, 1]);
  assert.deepEqual(grayCode(2), [0, 1, 3, 2]);
  assert.deepEqual(grayCode(3), [0, 1, 3, 2, 6, 7, 5, 4]);
});

test('grayCode 长度 2^n', () => {
  assert.equal(grayCode(4).length, 16);
  assert.equal(grayCode(5).length, 32);
});

test('grayCode 相邻仅差一位', () => {
  for (let n = 1; n <= 6; n++) {
    const codes = grayCode(n);
    for (let i = 1; i < codes.length; i++) {
      const diff = codes[i]! ^ codes[i - 1]!;
      assert.equal(diff & (diff - 1), 0, `${n}位第${i}个与前一码差不止一位`);
    }
    // 首尾也差一位
    const circularDiff = codes[0]! ^ codes[codes.length - 1]!;
    assert.equal(circularDiff & (circularDiff - 1), 0);
  }
});

test('grayCode 负数返回空', () => {
  assert.deepEqual(grayCode(-1), []);
});

test('toGray / fromGray 互逆', () => {
  for (let i = 0; i < 100; i++) {
    assert.equal(fromGray(toGray(i)), i);
  }
});

test('grayCode 钩子被调用', () => {
  let emits = 0;
  grayCode(3, { onEmit: () => emits++, onReflect: () => {} });
  assert.equal(emits, 8);
});
