import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mccarthy91,
  mccarthy91WithStats,
  mccarthy91ClosedForm,
} from '../../src/algorithms/recursion/mccarthy-91/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/recursion/mccarthy-91/trace.ts';

test('mccarthy91(50) = 91', () => {
  assert.equal(mccarthy91(50), 91);
});

test('mccarthy91(100) = 91', () => {
  assert.equal(mccarthy91(100), 91);
});

test('mccarthy91(101) = 91', () => {
  // n > 100 → n - 10 = 91
  assert.equal(mccarthy91(101), 91);
});

test('mccarthy91(70) = 91', () => {
  assert.equal(mccarthy91(70), 91);
});

test('mccarthy91(0) = 91', () => {
  assert.equal(mccarthy91(0), 91);
});

test('mccarthy91 对所有 n ≤ 100 恒为 91', () => {
  for (let n = -10; n <= 100; n++) {
    assert.equal(mccarthy91(n), 91, `M(${n})`);
  }
});

test('mccarthy91 对 n > 100 返回 n-10', () => {
  for (let n = 101; n <= 130; n++) {
    assert.equal(mccarthy91(n), n - 10, `M(${n})`);
  }
});

test('mccarthy91ClosedForm 与递归版一致', () => {
  for (let n = -5; n <= 120; n++) {
    assert.equal(mccarthy91ClosedForm(n), mccarthy91(n), `n=${n}`);
  }
});

test('91 是不动点：M(91) = 91', () => {
  assert.equal(mccarthy91(91), 91);
});

test('mccarthy91WithStats 返回调用次数与深度', () => {
  const { value, stats } = mccarthy91WithStats(50);
  assert.equal(value, 91);
  assert.ok(stats.calls > 0, '调用次数应 > 0');
  assert.ok(stats.maxDepth > 0, '最大深度应 > 0');
});

test('mccarthy91 拒绝非整数', () => {
  assert.throws(() => mccarthy91(1.5), RangeError);
  assert.throws(() => mccarthy91ClosedForm(2.5), RangeError);
});

test('mccarthy91 钩子 onCall/onReturn 数量相等', () => {
  let calls = 0;
  let returns = 0;
  mccarthy91(70, {
    onCall: () => calls++,
    onReturn: () => returns++,
  });
  assert.ok(calls > 0);
  assert.equal(calls, returns, '每次调用必有对应返回');
});

test('mccarthy91 onBase 在 n>100 时触发', () => {
  let baseCalls = 0;
  mccarthy91(101, {
    onBase: () => baseCalls++,
  });
  // M(101) 直接命中基线
  assert.equal(baseCalls, 1);
});

test('mccarthy91 根调用 depth=0', () => {
  let firstDepth = -1;
  mccarthy91(90, {
    onCall: (_n, depth) => {
      if (firstDepth < 0) firstDepth = depth;
    },
  });
  assert.equal(firstDepth, 0);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux, '终帧应有 aux');
});

test('buildTrace 终帧结果为 91（默认 n=80≤100）', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  const last = frames[frames.length - 1]!;
  const result = last.aux!.find((e) => e.label === '结果')!;
  assert.equal(result.value, 'M(80) = 91');
});
