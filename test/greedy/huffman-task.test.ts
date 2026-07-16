import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  huffmanTask,
  type HuffmanTaskHooks,
} from '../../src/algorithms/greedy/huffman-task/impl.ts';

test('huffman-task 边界情况', () => {
  assert.deepEqual(huffmanTask([]), { totalCost: 0, merges: [] });
  assert.deepEqual(huffmanTask([7]), { totalCost: 0, merges: [] });
});

test('huffman-task 经典用例（合并果子 洛谷 P1090）', () => {
  // 输入 5 2 8 1 9 3 7：每次合并最小两堆
  // 排序：1 2 3 5 7 8 9
  // 1+2=3 (cost3) → 3,3,5,7,8,9
  // 3+3=6 (cost6) → 5,6,7,8,9
  // 5+6=11 (cost11) → 7,8,9,11
  // 7+8=15 (cost15) → 9,11,15
  // 9+11=20 (cost20) → 15,20
  // 15+20=35 (cost35) → 55
  // 总代价 = 3+6+11+15+20+35 = 90
  assert.equal(huffmanTask([5, 2, 8, 1, 9, 3, 7]).totalCost, 90);
});

test('huffman-task 两堆', () => {
  // 3 + 5 = 8
  assert.deepEqual(huffmanTask([3, 5]), { totalCost: 8, merges: [[3, 5, 8]] });
});

test('huffman-task 三堆简单', () => {
  // 1 2 3 → 1+2=3 → 3,3 → 3+3=6 → 总 3+6=9
  assert.equal(huffmanTask([1, 2, 3]).totalCost, 9);
  const r = huffmanTask([1, 2, 3]);
  assert.equal(r.merges.length, 2);
});

test('huffman-task 最优性：贪心 ≤ 任意顺序', () => {
  // 对比一种非贪心合并顺序，贪心代价应更小
  const piles = [1, 2, 3, 4];
  const greedy = huffmanTask(piles).totalCost;
  // 非贪心：先合并最大的两堆 4+3=7，再 7+2=9，再 9+1=10 → 总 7+9+10=26
  assert.equal(greedy, 19); // 1+2=3;3+3=6;6+4=10 → 3+6+10=19
  assert.ok(greedy <= 26);
});

test('huffman-task 合并记录正确', () => {
  const r = huffmanTask([1, 2, 3]);
  // 每次 [a,b,c] 应满足 c=a+b
  for (const [a, b, c] of r.merges) {
    assert.equal(c, a + b);
  }
});

test('huffman-task 钩子被调用', () => {
  let picks = 0;
  let merges = 0;
  const hooks: HuffmanTaskHooks = {
    onPickMin: () => picks++,
    onMerge: () => merges++,
  };
  huffmanTask([5, 2, 8, 1], hooks);
  assert.ok(picks >= 3, `应至少 pick 3 次，实际 ${picks}`);
  assert.ok(merges >= 3, `应至少 merge 3 次，实际 ${merges}`);
});
