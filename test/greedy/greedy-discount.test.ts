import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyDiscount } from '../../src/algorithms/greedy/greedy-discount/impl.ts';

test('greedy-discount 经典凑单', () => {
  // sorted desc: 100,80,60,50,40,30,20; threshold 150 save 30
  // group1: 100+80=180 -> pay 150 ; group2: 60+50+40=150 -> pay 120 ; leftover 30,20 -> 50
  // total = 150+120+50 = 320, saved = 60
  const r = greedyDiscount([100, 80, 60, 50, 40, 30, 20], 150, 30);
  assert.equal(r.totalSaved, 60);
  assert.equal(r.totalPaid, 320);
});

test('greedy-discount 全部不成组', () => {
  const r = greedyDiscount([10, 20], 100, 50);
  assert.equal(r.totalSaved, 0);
  assert.equal(r.totalPaid, 30);
});

test('greedy-discount 单件即达阈值', () => {
  const r = greedyDiscount([200], 150, 30);
  assert.equal(r.totalPaid, 170);
  assert.equal(r.totalSaved, 30);
});
