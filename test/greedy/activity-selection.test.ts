import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  activitySelection,
  activitySelectionIndices,
  type Activity,
} from '../../src/algorithms/greedy/activity-selection/impl.ts';

const A = (start: number, end: number, id?: number): Activity => ({ start, end, id });

test('activity-selection 空输入', () => {
  assert.deepEqual(activitySelection([]), []);
  assert.deepEqual(activitySelectionIndices([]), []);
});

test('activity-selection 经典例子（CLRS）', () => {
  // CLRS 标准例子，活动下标 1..11；这里用 0..10
  const acts: Activity[] = [
    A(1, 4, 0),
    A(3, 5, 1),
    A(0, 6, 2),
    A(5, 7, 3),
    A(3, 9, 4),
    A(5, 9, 5),
    A(6, 10, 6),
    A(8, 11, 7),
    A(8, 12, 8),
    A(2, 14, 9),
    A(12, 16, 10),
  ];
  const selected = activitySelection(acts);
  // 经典最优解：活动 0,3,7,10（结束时间 4,7,11,16）
  assert.equal(selected.length, 4);
  assert.deepEqual(
    selected.map((a) => a.id),
    [0, 3, 7, 10],
  );
});

test('activity-selection 索引重载', () => {
  const idx = activitySelectionIndices([
    [1, 4],
    [3, 5],
    [0, 6],
    [5, 7],
    [3, 9],
    [5, 9],
    [6, 10],
    [8, 11],
    [8, 12],
    [2, 14],
    [12, 16],
  ]);
  assert.deepEqual(idx, [0, 3, 7, 10]);
});

test('activity-selection 结果互不重叠', () => {
  const acts: Activity[] = [A(1, 3), A(2, 5), A(4, 6), A(6, 7), A(5, 9), A(8, 10)];
  const sel = activitySelection(acts);
  for (let i = 1; i < sel.length; i++) {
    assert.ok(sel[i]!.start >= sel[i - 1]!.end, '相邻选中活动不应重叠');
  }
});

test('activity-selection 全部可同时进行', () => {
  const acts: Activity[] = [A(1, 2, 0), A(2, 3, 1), A(3, 4, 2)];
  const sel = activitySelection(acts);
  assert.equal(sel.length, 3);
});

test('activity-selection 单个活动', () => {
  const sel = activitySelection([A(5, 9, 0)]);
  assert.equal(sel.length, 1);
  assert.equal(sel[0]!.id, 0);
});

test('activity-selection 不修改原数组', () => {
  const acts: Activity[] = [A(5, 9, 0), A(1, 4, 1), A(2, 3, 2)];
  const orig = acts.map((a) => ({ ...a }));
  activitySelection(acts);
  assert.deepEqual(acts, orig);
});

test('activity-selection 钩子被调用', () => {
  let sortCnt = 0;
  let selCnt = 0;
  let rejCnt = 0;
  activitySelection([A(1, 3, 0), A(2, 5, 1), A(4, 6, 2), A(5, 7, 3)], {
    onSort: () => sortCnt++,
    onSelect: () => selCnt++,
    onReject: () => rejCnt++,
  });
  assert.equal(sortCnt, 1);
  assert.ok(selCnt >= 1, '至少选中一个');
  assert.ok(rejCnt >= 1, '至少拒绝一个');
});
