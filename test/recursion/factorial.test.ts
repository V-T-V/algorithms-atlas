import { test } from 'node:test';
import assert from 'node:assert/strict';
import { factorial, factorialIterative } from '../../src/algorithms/recursion/factorial/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/recursion/factorial/trace.ts';

const KNOWN = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800];

test('factorial 前 10 项正确', () => {
  for (let n = 0; n < KNOWN.length; n++) {
    assert.equal(factorial(n), KNOWN[n], `${n}!`);
  }
});

test('factorial 边界', () => {
  assert.equal(factorial(0), 1);
  assert.equal(factorial(1), 1);
  assert.equal(factorial(2), 2);
});

test('factorial 较大值正确', () => {
  assert.equal(factorial(15), 1307674368000);
  // 18! 仍在安全整数范围内
  assert.equal(factorial(18), 6402373705728000);
});

test('factorialIterative 与递归一致', () => {
  for (let n = 0; n <= 18; n++) {
    assert.equal(factorialIterative(n), factorial(n), `${n}! 递归 vs 迭代`);
  }
});

test('factorial 拒绝非法输入', () => {
  assert.throws(() => factorial(-1), RangeError);
  assert.throws(() => factorial(1.5), RangeError);
  assert.throws(() => factorialIterative(-1), RangeError);
});

test('factorial 钩子 onRecurse 被调用 n+1 次', () => {
  let recurseCalls = 0;
  const depths: number[] = [];
  factorial(5, {
    onRecurse: (_n, depth) => {
      recurseCalls++;
      depths.push(depth);
    },
  });
  // factorial(5..0) 共 6 次进入
  assert.equal(recurseCalls, 6);
  // 深度应为 0,1,2,3,4,5
  assert.deepEqual(depths, [0, 1, 2, 3, 4, 5]);
});

test('factorial 钩子 onBase 在 n=0 触发一次', () => {
  let baseCalls = 0;
  let baseArg = -1;
  factorial(5, {
    onBase: (n) => {
      baseCalls++;
      baseArg = n;
    },
  });
  assert.equal(baseCalls, 1);
  assert.equal(baseArg, 0);
});

test('factorial 钩子 onReturn 触发 n+1 次', () => {
  let returns = 0;
  const returnVals: Array<{ k: number; v: number }> = [];
  factorial(5, {
    onReturn: (k, v) => {
      returns++;
      returnVals.push({ k, v });
    },
  });
  assert.equal(returns, 6);
  // 返回顺序：0→1, 1→1, 2→2, ..., 5→120
  assert.deepEqual(returnVals, [
    { k: 0, v: 1 },
    { k: 1, v: 1 },
    { k: 2, v: 2 },
    { k: 3, v: 6 },
    { k: 4, v: 24 },
    { k: 5, v: 120 },
  ]);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 5);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '终帧应有 bars');
});

test('buildTrace 终帧含正确结果', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  const last = frames[frames.length - 1]!;
  const result = last.aux!.find((e) => e.label === '结果')!;
  // 6! = 720
  assert.equal(result.value, '6! = 720');
});
