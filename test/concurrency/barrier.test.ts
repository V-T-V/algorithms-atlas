import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Barrier, simulateBarrier } from '../../src/algorithms/concurrency/barrier/impl.ts';

test('barrier 第 n 个到达者返回 true 并重置', () => {
  const b = new Barrier(3);
  assert.equal(b.await(0), false);
  assert.equal(b.waiting, 1);
  assert.equal(b.await(1), false);
  assert.equal(b.waiting, 2);
  // 第 3 个 → 放行
  assert.equal(b.await(2), true);
  assert.equal(b.waiting, 0); // 重置
  assert.equal(b.gen, 1);
});

test('barrier 可循环复用（cyclic）', () => {
  const b = new Barrier(2);
  b.await(0);
  b.await(1); // 放行 gen 1
  assert.equal(b.gen, 1);
  b.await(0);
  assert.equal(b.await(1), true); // 放行 gen 2
  assert.equal(b.gen, 2);
  assert.equal(b.waiting, 0);
});

test('barrier 钩子 onRelease 在最后到达时触发', () => {
  let releaseGen = -1;
  let resets = 0;
  const b = new Barrier(3, {
    onRelease: (g) => (releaseGen = g),
    onReset: () => resets++,
  });
  b.await(0);
  assert.equal(releaseGen, -1); // 尚未放行
  b.await(1);
  assert.equal(releaseGen, -1);
  b.await(2);
  assert.equal(releaseGen, 0); // 第 0 代放行
  assert.equal(resets, 1);
});

test('simulateBarrier 跟踪每步状态', () => {
  const steps = simulateBarrier(3, [
    { threadId: 0 },
    { threadId: 1 },
    { threadId: 2 }, // 放行
    { threadId: 0 }, // 新一代
  ]);
  assert.deepEqual(
    steps.map((s) => s.arrived),
    [1, 2, 0, 1], // 第三步放行归零
  );
  assert.deepEqual(
    steps.map((s) => s.generation),
    [0, 0, 1, 1],
  );
  assert.deepEqual(
    steps.map((s) => s.released),
    [false, false, true, false],
  );
});

test('barrier parties=1 时单线程立即放行', () => {
  const b = new Barrier(1);
  assert.equal(b.await(0), true);
  assert.equal(b.gen, 1);
});
