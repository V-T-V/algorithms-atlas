import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  staircaseWays,
  staircaseWaysMemo,
  staircaseSequence,
} from '../../src/algorithms/recursion/staircase-ways/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/recursion/staircase-ways/trace.ts';

// 已知序列：ways(0)=1, ways(1)=1, ways(2)=2, ..., ways(n) = fib(n+1)
const KNOWN = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

test('staircaseWays 前 10 项正确', () => {
  for (let n = 0; n < KNOWN.length; n++) {
    assert.equal(staircaseWays(n), KNOWN[n], `ways(${n})`);
  }
});

test('staircaseWays 边界', () => {
  assert.equal(staircaseWays(0), 1);
  assert.equal(staircaseWays(1), 1);
  assert.equal(staircaseWays(2), 2);
});

test('staircaseWays(5) = 8', () => {
  assert.equal(staircaseWays(5), 8);
});

test('staircaseWaysMemo 与朴素版一致', () => {
  for (let n = 0; n <= 15; n++) {
    assert.equal(staircaseWaysMemo(n), staircaseWays(n), `n=${n}`);
  }
});

test('staircaseWaysMemo 较大值正确', () => {
  assert.equal(staircaseWaysMemo(20), 10946);
  assert.equal(staircaseWaysMemo(30), 1346269);
});

test('staircaseWaysMemo 缓存可复用', () => {
  const memo = new Map<number, number>();
  const r1 = staircaseWaysMemo(10, memo);
  // 第二次调用 ways(10) 直接命中缓存（memo 已含全部 0..10），
  // 函数在 has(n) 命中后立即返回，不再向下递归，故仅 1 次命中。
  let hits = 0;
  const r2 = staircaseWaysMemo(10, memo, {
    onMemoHit: () => hits++,
  });
  assert.equal(r1, r2);
  assert.equal(r1, 89);
  assert.equal(hits, 1, '预填充缓存下 ways(10) 恰好 1 次命中');
});

test('staircaseSequence 正确', () => {
  assert.deepEqual(staircaseSequence(0), [1]);
  assert.deepEqual(staircaseSequence(1), [1, 1]);
  assert.deepEqual(staircaseSequence(5), [1, 1, 2, 3, 5, 8]);
  assert.deepEqual(staircaseSequence(10), KNOWN.slice(0, 11));
});

test('staircaseWays 拒绝非法输入', () => {
  assert.throws(() => staircaseWays(-1), RangeError);
  assert.throws(() => staircaseWays(1.5), RangeError);
  assert.throws(() => staircaseWaysMemo(-1), RangeError);
  assert.throws(() => staircaseSequence(-1), RangeError);
});

test('staircaseWays 钩子 onRecurse 被调用', () => {
  let calls = 0;
  staircaseWays(5, {
    onRecurse: () => calls++,
  });
  // 节点计数 T(n)：T(0)=T(1)=1，T(n)=1+T(n-1)+T(n-2)；T(5)=15
  assert.ok(calls >= 6);
  assert.equal(calls, 15);
});

test('staircaseWaysMemo 钩子被调用且命中缓存', () => {
  let hits = 0;
  let stores = 0;
  staircaseWaysMemo(10, new Map(), {
    onMemoHit: () => hits++,
    onMemoStore: () => stores++,
  });
  // ways(0..10) 全部写入 = 11 项
  assert.equal(stores, 11, '应存储 11 项');
  assert.ok(hits > 0, '应有缓存命中');
});

test('staircaseWaysMemo 朴素版调用次数远多于记忆化', () => {
  let naiveCalls = 0;
  let memoStores = 0;
  staircaseWays(15, { onRecurse: () => naiveCalls++ });
  staircaseWaysMemo(15, new Map(), { onMemoStore: () => memoStores++ });
  assert.ok(naiveCalls > memoStores * 10, `朴素(${naiveCalls}) 应远多于记忆化写入(${memoStores})`);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 5);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '终帧应有 bars');
});

test('buildTrace 终帧含正确结果 ways(6)=13', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  const last = frames[frames.length - 1]!;
  const result = last.aux!.find((e) => e.label === 'ways(n)')!;
  assert.equal(result.value, '13');
});
