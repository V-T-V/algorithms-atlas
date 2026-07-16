import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diningPhilosophers } from '../../src/algorithms/concurrency/dining-philosophers/impl.ts';

test('dining-philosophers 完成所有就餐且无死锁', () => {
  const r = diningPhilosophers(5, 2);
  assert.equal(r.deadlockFree, true);
  // 5 个哲学家各 2 餐 = 10 轮
  assert.equal(r.roundsCompleted, 10);
});

test('dining-philosophers 边界 n<2', () => {
  const r = diningPhilosophers(1, 3);
  assert.equal(r.roundsCompleted, 0);
  assert.equal(r.deadlockFree, true);
});

test('dining-philosophers 资源分级：每次拿叉先小后大', () => {
  // 记录每个哲学家拿叉子的顺序
  const picks: Record<number, number[]> = {};
  for (let i = 0; i < 5; i++) picks[i] = [];
  diningPhilosophers(5, 1, {
    onPick: (i, fork) => picks[i]!.push(fork),
  });
  for (let i = 0; i < 5; i++) {
    const seq = picks[i]!;
    assert.equal(seq.length, 2, `P${i} 应拿 2 把叉子`);
    // 资源分级：第一把编号 <= 第二把
    assert.ok(seq[0]! <= seq[1]!, `P${i} 应先拿编号小的叉子`);
  }
});

test('dining-philosophers 钩子被调用且就餐=放叉次数', () => {
  let eatCount = 0;
  let pickCount = 0;
  let putCount = 0;
  diningPhilosophers(3, 2, {
    onEat: () => eatCount++,
    onPick: () => pickCount++,
    onPut: () => putCount++,
  });
  // 3 哲学家 × 2 餐 = 6 次就餐，每次 2 拿 2 放
  assert.equal(eatCount, 6);
  assert.equal(pickCount, 12);
  assert.equal(putCount, 12);
});
