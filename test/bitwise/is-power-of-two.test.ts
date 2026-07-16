import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isPowerOfTwo,
  isPowerOfTwoByDivision,
  toBinaryArray,
} from '../../src/algorithms/bitwise/is-power-of-two/impl.ts';

test('is-power-of-two 正确识别 2 的幂', () => {
  for (const k of [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 16, 20, 30]) {
    const v = 2 ** k;
    assert.equal(isPowerOfTwo(v), true, `2^${k}=${v} 应为 2 的幂`);
  }
  assert.equal(isPowerOfTwo(1), true);
  assert.equal(isPowerOfTwo(2), true);
  assert.equal(isPowerOfTwo(4), true);
  assert.equal(isPowerOfTwo(8), true);
  assert.equal(isPowerOfTwo(1024), true);
});

test('is-power-of-two 排除非 2 的幂', () => {
  for (const n of [0, 3, 5, 6, 7, 9, 10, 15, 18, 31, 33, 100, 1023, 1025]) {
    assert.equal(isPowerOfTwo(n), false, `${n} 不应是 2 的幂`);
  }
});

test('is-power-of-two 拒绝非整数', () => {
  assert.throws(() => isPowerOfTwo(1.5), RangeError);
  assert.throws(() => isPowerOfTwo(2.5), RangeError);
});

test('is-power-of-two 非正整数返回 false', () => {
  assert.equal(isPowerOfTwo(0), false);
  assert.equal(isPowerOfTwo(-1), false);
  assert.equal(isPowerOfTwo(-8), false);
});

test('is-power-of-two 两种方法结果一致', () => {
  for (let i = 0; i <= 65536; i++) {
    const a = isPowerOfTwo(i);
    const b = isPowerOfTwoByDivision(i);
    assert.equal(a, b, `n=${i}: bit-trick=${a} division=${b}`);
  }
});

test('toBinaryArray 正确', () => {
  assert.deepEqual(toBinaryArray(0, 4), [0, 0, 0, 0]);
  assert.deepEqual(toBinaryArray(1, 4), [0, 0, 0, 1]);
  assert.deepEqual(toBinaryArray(8, 4), [1, 0, 0, 0]);
  assert.deepEqual(toBinaryArray(15, 4), [1, 1, 1, 1]);
});

test('is-power-of-two 钩子被调用', () => {
  let binaryCalls = 0;
  let minusOneCalls = 0;
  let andCalls = 0;
  let resultCalls = 0;
  let lastResult: boolean | null = null;
  const r = isPowerOfTwo(8, {
    onBinary: () => binaryCalls++,
    onMinusOne: () => minusOneCalls++,
    onAnd: (andResult) => {
      andCalls++;
      assert.equal(andResult, 0, '8 & 7 应为 0');
    },
    onResult: (_n, isPow2) => {
      resultCalls++;
      lastResult = isPow2;
    },
  });
  assert.equal(r, true);
  assert.equal(binaryCalls, 1);
  assert.equal(minusOneCalls, 1);
  assert.equal(andCalls, 1);
  assert.equal(resultCalls, 1);
  assert.equal(lastResult, true);
});

test('is-power-of-two 非幂时 n&(n-1) !== 0', () => {
  let andResult = -1;
  isPowerOfTwo(6, {
    onAnd: (r) => {
      andResult = r;
    },
  });
  assert.equal(andResult, 6 & 5);
  assert.notEqual(andResult, 0);
});
