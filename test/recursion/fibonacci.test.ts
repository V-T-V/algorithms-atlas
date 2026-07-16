import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fibRecursive,
  fibMemoized,
  fibMatrix,
  fibonacciSequence,
} from '../../src/algorithms/recursion/fibonacci/impl.ts';

const KNOWN = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181];

test('三种方法对前 20 项结果一致且正确', () => {
  for (let n = 0; n < KNOWN.length; n++) {
    const r = fibRecursive(n);
    const m = fibMemoized(n);
    const x = fibMatrix(n);
    assert.equal(r, KNOWN[n], `fibRecursive(${n})`);
    assert.equal(m, KNOWN[n], `fibMemoized(${n})`);
    assert.equal(x, KNOWN[n], `fibMatrix(${n})`);
  }
});

test('fibRecursive 边界', () => {
  assert.equal(fibRecursive(0), 0);
  assert.equal(fibRecursive(1), 1);
  assert.equal(fibRecursive(2), 1);
});

test('fibMemoized 大 n 正确', () => {
  assert.equal(fibMemoized(30), 832040);
  assert.equal(fibMemoized(40), 102334155);
});

test('fibMatrix 大 n 正确', () => {
  assert.equal(fibMatrix(30), 832040);
  assert.equal(fibMatrix(50), 12586269025);
  assert.equal(fibMatrix(70), 190392490709135);
});

test('三种方法对 n=25 完全一致', () => {
  for (let n = 0; n <= 25; n++) {
    assert.equal(fibRecursive(n), fibMemoized(n), `recursive vs memoized at ${n}`);
    assert.equal(fibMemoized(n), fibMatrix(n), `memoized vs matrix at ${n}`);
  }
});

test('fibonacciSequence 生成前 n 项', () => {
  assert.deepEqual(fibonacciSequence(0), []);
  assert.deepEqual(fibonacciSequence(1), [0]);
  assert.deepEqual(fibonacciSequence(2), [0, 1]);
  assert.deepEqual(fibonacciSequence(10), KNOWN.slice(0, 10));
});

test('拒绝非法输入', () => {
  assert.throws(() => fibRecursive(-1), RangeError);
  assert.throws(() => fibMemoized(-1), RangeError);
  assert.throws(() => fibMatrix(-1), RangeError);
  assert.throws(() => fibRecursive(1.5), RangeError);
  assert.throws(() => fibonacciSequence(-1), RangeError);
});

test('fibRecursive 钩子被调用', () => {
  let recurseCalls = 0;
  fibRecursive(5, {
    onRecurse: () => recurseCalls++,
  });
  // 朴素递归 fib(5) 的调用次数 = 2*fib(5+1)-1 = 15
  assert.ok(recurseCalls >= 5, '应多次递归调用');
  assert.equal(recurseCalls, 15);
});

test('fibMemoized 钩子被调用且命中缓存', () => {
  let hits = 0;
  let stores = 0;
  fibMemoized(10, {
    onMemoHit: () => hits++,
    onMemoStore: () => stores++,
  });
  // fib(0..10) 中 fib(0)、fib(1) 不存，fib(2..10) 共 9 次存储
  assert.equal(stores, 9, '应存储 9 项（fib(2)..fib(10)）');
  assert.ok(hits > 0, '应有缓存命中');
});

test('fibMatrix 钩子被调用', () => {
  let steps = 0;
  let resultCalls = 0;
  let lastResult = -1;
  const v = fibMatrix(10, {
    onMatrixStep: () => steps++,
    onResult: (_m, _n, val) => {
      resultCalls++;
      lastResult = val;
    },
  });
  assert.equal(v, 55);
  assert.ok(steps >= 1, '矩阵步骤应大于 0');
  assert.equal(resultCalls, 1);
  assert.equal(lastResult, 55);
});
