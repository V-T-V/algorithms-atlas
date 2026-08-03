import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combinationsum } from '../../src/algorithms/backtracking/combination-sum/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/combination-sum/trace.ts';

const norm = (combos: number[][]): string[] =>
  combos.map((c) => [...c].sort((a, b) => a - b).join(',')).sort();

test('combination-sum：经典用例 [2,3,6,7] target=7', () => {
  const r = combinationsum([2, 3, 6, 7], 7);
  // 期望：[7] 与 [2,2,3]
  assert.deepEqual(norm(r), ['2,2,3', '7']);
});

test('combination-sum：可重复使用候选', () => {
  const r = combinationsum([1], 3);
  assert.deepEqual(norm(r), ['1,1,1']);
});

test('combination-sum：无解返回空', () => {
  assert.deepEqual(combinationsum([2], 3), []);
});

test('combination-sum：target=0 返回一个空组合', () => {
  const r = combinationsum([2, 3], 0);
  assert.equal(r.length, 1);
  assert.deepEqual(r[0], []);
});

test('combination-sum：负 target 返回空', () => {
  assert.deepEqual(combinationsum([1, 2], -5), []);
});

test('combination-sum：忽略非正/非整候选', () => {
  // 0、负数、小数应被忽略，不影响结果
  const r = combinationsum([2, 0, -1, 3, 2.5], 5);
  assert.deepEqual(norm(r), ['2,3']);
});

test('combination-sum：结果组合去重（顺序不同视为同一组合）', () => {
  // 候选 [3,2] 乱序，结果应与 [2,3] 一致（start 去重）
  const r = combinationsum([3, 2], 5);
  assert.deepEqual(norm(r), ['2,3']);
});

test('combination-sum：结果组合元素之和恰为 target', () => {
  const r = combinationsum([2, 3, 5], 17);
  for (const c of r) {
    const s = c.reduce((a, b) => a + b, 0);
    assert.equal(s, 17, `组合 ${c} 之和应为 17`);
  }
  assert.ok(r.length > 0);
});

test('combination-sum：钩子按选/撤销/结果顺序触发', () => {
  const picks: number[] = [];
  const undos: number[] = [];
  const results: number[][] = [];
  combinationsum([2, 3, 6, 7], 7, {
    onPick: (v) => picks.push(v),
    onBacktrack: (v) => undos.push(v),
    onResult: (c) => results.push([...c]),
  });
  assert.ok(picks.length > 0, '应有选操作');
  assert.ok(undos.length > 0, '应有撤销操作');
  assert.ok(results.length >= 1, '应至少找到一个组合');
  // 每个 result 之前都应有过 pick
  assert.ok(picks.length >= results.length);
});

test('combination-sum：onSkip 在剪枝时触发', () => {
  const skipped: number[] = [];
  combinationsum([2, 5, 8], 7, {
    onSkip: (v) => skipped.push(v),
  });
  // remain<8 时 8 应被剪枝
  assert.ok(skipped.includes(8));
});

test('buildTrace 生成有序帧且含候选与剩余信息', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3, '应有多帧动画');
  // 末帧含组合数
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux?.some((a) => a.label === '组合数'));
  // 中间至少一帧出现「选」或「撤销」或「找到」语义
  const notes = frames.map((f) => f.note?.zh ?? '').join('|');
  assert.ok(/选|撤销|找到/.test(notes), '应呈现选/撤销/找到步骤');
});
