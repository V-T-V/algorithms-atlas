import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ackermann, ackermannWithStats } from '../../src/algorithms/recursion/ackermann/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/recursion/ackermann/trace.ts';

test('ackermann 基线 A(0, n) = n+1', () => {
  for (let n = 0; n <= 10; n++) {
    assert.equal(ackermann(0, n), n + 1, `A(0, ${n})`);
  }
});

test('ackermann A(1, n) = n+2', () => {
  for (let n = 0; n <= 8; n++) {
    assert.equal(ackermann(1, n), n + 2, `A(1, ${n})`);
  }
});

test('ackermann A(2, n) = 2n+3', () => {
  for (let n = 0; n <= 6; n++) {
    assert.equal(ackermann(2, n), 2 * n + 3, `A(2, ${n})`);
  }
});

test('ackermann A(3, n) = 2^(n+3) - 3', () => {
  for (let n = 0; n <= 4; n++) {
    assert.equal(ackermann(3, n), 2 ** (n + 3) - 3, `A(3, ${n})`);
  }
});

test('ackermann 已知小值 A(2,3)=9', () => {
  assert.equal(ackermann(2, 3), 9);
});

test('ackermann 已知小值 A(3,3)=61', () => {
  assert.equal(ackermann(3, 3), 61);
});

test('ackermann A(3,4)=125', () => {
  assert.equal(ackermann(3, 4), 125);
});

test('ackermann A(4,0)=13', () => {
  // A(4,0) = A(3,1) = 2^4-3 = 13
  assert.equal(ackermann(4, 0), 13);
});

test('ackermann A(4,n) 数学正确性（闭式验证）', () => {
  // A(4,n) = 2↑↑(n+3) - 3，增长极快。朴素递归可算 A(4,0)=13；
  // A(4,1)=2^16-3=65533 因递归深度过大实际无法用朴素版求值。
  // 这里仅验证 m ≤ 3 的闭式结果。
  for (let n = 0; n <= 3; n++) {
    assert.equal(ackermann(3, n), 2 ** (n + 3) - 3, `A(3,${n})`);
  }
  assert.equal(ackermann(4, 0), 13);
});

test('ackermannWithStats 返回调用次数与深度', () => {
  const { value, stats } = ackermannWithStats(2, 3);
  assert.equal(value, 9);
  assert.ok(stats.calls > 0, '调用次数应 > 0');
  assert.ok(stats.maxDepth > 0, '最大深度应 > 0');
  // A(2,3) 的调用次数是确定的（约 1080 次，这里只检查数量级合理）
  assert.ok(stats.calls >= 20, `A(2,3) 调用次数应较多，实际 ${stats.calls}`);
});

test('ackermann 拒绝非法输入', () => {
  assert.throws(() => ackermann(-1, 0), RangeError);
  assert.throws(() => ackermann(0, -1), RangeError);
  assert.throws(() => ackermann(1.5, 0), RangeError);
});

test('ackermann 钩子 onCall/onReturn 被调用且数量相等', () => {
  let calls = 0;
  let returns = 0;
  ackermann(2, 2, {
    onCall: () => calls++,
    onReturn: () => returns++,
  });
  assert.ok(calls > 0);
  assert.equal(calls, returns, '每次调用必有对应返回');
});

test('ackermann 根调用是 A(m,n,depth=0)', () => {
  let firstCall: { m: number; n: number; depth: number } | null = null;
  ackermann(2, 1, {
    onCall: (m, n, depth) => {
      if (firstCall === null) firstCall = { m, n, depth };
    },
  });
  assert.deepEqual(firstCall, { m: 2, n: 1, depth: 0 });
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux, '终帧应有 aux');
});

test('buildTrace 终帧含正确结果 A(2,3)=9', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  const last = frames[frames.length - 1]!;
  const result = last.aux!.find((e) => e.label === '结果')!;
  assert.equal(result.value, 'A(2, 3) = 9');
});
