import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mergeLALR,
  detectMergeConflicts,
  type LR1State,
  type MergeHooks,
} from '../../src/algorithms/parsing/parse-lalr-merge/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/parsing/parse-lalr-merge/trace.ts';

test('parse-lalr-merge 合并同心状态', () => {
  const r = mergeLALR(DEFAULT_INPUT.states);
  // 状态 0 和 1 同核（0.0, 1.1）→ 合并为 1 个；状态 2 核不同
  assert.ok(r.lalrStates.length < DEFAULT_INPUT.states.length);
});

test('parse-lalr-merge lookahead 取并集', () => {
  const r = mergeLALR(DEFAULT_INPUT.states);
  // 找到合并了 I0 I1 的状态，其项目 lookahead 应含 $ 和 ,
  const merged = r.lalrStates.find((s) => s.sourceIds.includes(0) && s.sourceIds.includes(1));
  assert.ok(merged);
  const item = merged!.items.find((it) => it.core.prodIndex === 0 && it.core.dot === 0);
  assert.ok(item);
  assert.ok(item!.lookaheads.includes('$'));
  assert.ok(item!.lookaheads.includes(','));
});

test('parse-lalr-merge 不同核不合并', () => {
  const r = mergeLALR(DEFAULT_INPUT.states);
  // 状态 2 单独成组
  const grp2 = r.lalrStates.find((s) => s.sourceIds.length === 1 && s.sourceIds[0] === 2);
  assert.ok(grp2);
});

test('parse-lalr-merge 分组数 = LALR 状态数', () => {
  const r = mergeLALR(DEFAULT_INPUT.states);
  assert.equal(r.groups.length, r.lalrStates.length);
});

test('parse-lalr-merge 完全同核全合并', () => {
  const states: LR1State[] = [
    { id: 0, items: [{ core: { prodIndex: 0, dot: 0 }, lookaheads: ['a'] }] },
    { id: 1, items: [{ core: { prodIndex: 0, dot: 0 }, lookaheads: ['b'] }] },
  ];
  const r = mergeLALR(states);
  assert.equal(r.lalrStates.length, 1);
  assert.equal(r.lalrStates[0]!.items[0]!.lookaheads.length, 2);
});

test('parse-lalr-merge detectMergeConflicts 无冲突', () => {
  const r = mergeLALR(DEFAULT_INPUT.states);
  const conflicts = detectMergeConflicts(r.lalrStates, DEFAULT_INPUT.prods);
  // 该输入不引入 reduce/reduce 冲突
  assert.equal(conflicts.length, 0);
});

test('parse-lalr-merge detectMergeConflicts 检测冲突', () => {
  // 构造两个完成项目 lookahead 相同但 lhs 不同
  const prods = [
    { lhs: 'A', rhs: ['x'] },
    { lhs: 'B', rhs: ['x'] },
  ];
  const lalrStates = [
    {
      sourceIds: [0],
      items: [
        { core: { prodIndex: 0, dot: 1 }, lookaheads: ['$'] },
        { core: { prodIndex: 1, dot: 1 }, lookaheads: ['$'] },
      ],
    },
  ];
  const conflicts = detectMergeConflicts(lalrStates, prods);
  assert.ok(conflicts.length >= 1);
  assert.ok(conflicts[0]!.lhs.includes('A'));
  assert.ok(conflicts[0]!.lhs.includes('B'));
});

test('parse-lalr-merge 钩子', () => {
  let groups = 0;
  let results = 0;
  const hooks: MergeHooks = {
    onGroup: () => groups++,
    onResult: () => results++,
  };
  mergeLALR(DEFAULT_INPUT.states, hooks);
  assert.ok(groups >= 1);
  assert.equal(results, 1);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux);
  const last = frames[frames.length - 1]!;
  const cur = last.aux!.find((e) => e.label === 'LALR 状态数');
  assert.ok(cur);
});
