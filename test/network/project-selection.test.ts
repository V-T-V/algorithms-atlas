import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  projectSelection,
  projectSelectionSet,
} from '../../src/algorithms/network/project-selection/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/network/project-selection/trace.ts';

test('project 全正利润无依赖：选全部', () => {
  const v = projectSelection(3, [{ profit: 4 }, { profit: 3 }, { profit: 5 }], []);
  assert.equal(v, 12);
});

test('project 单个负利润：不选', () => {
  assert.equal(projectSelection(1, [{ profit: -5 }], []), 0);
});

test('project 单个正利润：选', () => {
  assert.equal(projectSelection(1, [{ profit: 7 }], []), 7);
});

test('project 依赖迫使选负项目：净收益正确', () => {
  // P0 利润 4，P1 利润 3，选 P1 必须选 P0；无负成本
  const v = projectSelection(2, [{ profit: 4 }, { profit: 3 }], [[0, 1]]);
  assert.equal(v, 7);
});

test('project 选正项目必须连带负成本', () => {
  // P0 +10，P1 -2（成本），选 P0 必须选 P1（依赖 [1,0]：选 P0 须先选 P1）
  // 净收益 = 10 - 2 = 8 > 0，应选
  const v = projectSelection(2, [{ profit: 10 }, { profit: -2 }], [[1, 0]]);
  assert.equal(v, 8);
});

test('project 依赖成本过高则不选', () => {
  // P0 +3，P1 -10（成本），选 P0 必须选 P1 → 净 3-10=-7 < 0，应放弃 P0
  const v = projectSelection(2, [{ profit: 3 }, { profit: -10 }], [[1, 0]]);
  assert.equal(v, 0);
});

test('project 复合依赖（链）', () => {
  // P0 +5, P1 +4, P2 -8（成本）；选 P1 必须选 P0；选 P0 必须选 P2
  // 选 P1 → 须选 P0 → 须选 P2：净 5+4-8=1
  // 或不选 P1，仅 P0+P2：净 5-8=-3，放弃
  // 最优 = 选 P1,P0,P2：净 1
  const v = projectSelection(
    3,
    [{ profit: 5 }, { profit: 4 }, { profit: -8 }],
    [
      [0, 1],
      [2, 0],
    ],
  );
  assert.equal(v, 1);
});

test('project 全负利润：选空集净收益 0', () => {
  assert.equal(projectSelection(3, [{ profit: -1 }, { profit: -2 }, { profit: -3 }], []), 0);
});

test('project n<=0 返回 0', () => {
  assert.equal(projectSelection(0, [], []), 0);
});

test('project 钩子 onDone', () => {
  let done = -999;
  projectSelection(2, [{ profit: 10 }, { profit: -2 }], [[1, 0]], {
    onDone: (v) => (done = v),
  });
  assert.equal(done, 8);
});

test('projectSelectionSet 选中集合闭合且净收益一致', () => {
  const r = projectSelectionSet(
    3,
    [{ profit: 5 }, { profit: 4 }, { profit: -8 }],
    [
      [0, 1],
      [2, 0],
    ],
  );
  assert.equal(r.value, 1);
  // 闭合性：若选中 P1，则 P0、P2 都应选中
  if (r.selected.has(1)) {
    assert.ok(r.selected.has(0));
    assert.ok(r.selected.has(2));
  }
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.note!.zh.includes('净收益'));
});
