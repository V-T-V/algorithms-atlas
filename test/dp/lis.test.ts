import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lis } from '../../src/algorithms/dp/lis/impl.ts';

// 辅助：判定一个数组是否是给定输入的「合法递增子序列」（保持相对顺序 + 严格递增）。
function isStrictlyIncreasing(a: readonly number[]): boolean {
  for (let i = 1; i < a.length; i++) if (a[i]! <= a[i - 1]!) return false;
  return true;
}

test('lis 基本行为', () => {
  assert.deepEqual(lis([]), []);
  assert.deepEqual(lis([1]), [1]);
});

test('lis 长度与严格递增', () => {
  const cases: Array<{ input: number[]; len: number }> = [
    { input: [10, 9, 2, 5, 3, 7, 101, 18], len: 4 }, // 经典：2,3,7,101
    { input: [5, 2, 8, 1, 9, 3, 7, 4, 6], len: 4 }, // 2,3,4,6 / 2,3,7,9
    { input: [1, 2, 3, 4, 5], len: 5 }, // 已升序
    { input: [5, 4, 3, 2, 1], len: 1 }, // 已降序
    { input: [3, 3, 3, 3], len: 1 }, // 全等（严格递增）
  ];
  for (const { input, len } of cases) {
    const res = lis(input);
    assert.equal(res.length, len, `len mismatch for ${JSON.stringify(input)}`);
    assert.ok(isStrictlyIncreasing(res), `结果非严格递增：${JSON.stringify(res)}`);
  }
});

test('lis 不修改原数组', () => {
  const input = [3, 1, 2];
  lis(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('lis 钩子被调用', () => {
  let fill = 0;
  let backtrack = 0;
  lis([3, 1, 2], {
    onFillCell: () => fill++,
    onBacktrack: () => backtrack++,
  });
  assert.equal(fill, 3, '每个元素应触发一次 onFillCell');
  assert.ok(backtrack > 0, '回溯应触发 onBacktrack');
});
