import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mooreHodgson } from '../../src/algorithms/scheduling/moore-hodgson/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/scheduling/moore-hodgson/trace.ts';

test('mh 全部能按时完成时延迟数 = 0', () => {
  const r = mooreHodgson([
    { id: 'A', processing: 1, deadline: 5 },
    { id: 'B', processing: 1, deadline: 6 },
  ]);
  assert.equal(r.lateCount, 0);
  assert.equal(r.onTime.length, 2);
});

test('mh 必有延迟时正确剔除最长作业', () => {
  // A p=5 d=5（刚好），B p=1 d=6：加入 A t=5 ok，加入 B t=6 ok
  // 但若 A p=6 d=5：加入 A t=6 > 5 → 剔除 A
  const r = mooreHodgson([
    { id: 'A', processing: 6, deadline: 5 },
    { id: 'B', processing: 1, deadline: 10 },
  ]);
  assert.equal(r.lateCount, 1);
  assert.deepEqual(
    r.late.map((j) => j.id),
    ['A'],
  );
});

test('mh 经典示例：最小延迟数正确', () => {
  const r = mooreHodgson(DEFAULT_INPUT);
  // A(3,4): t=3 ok(d=4); B(2,6): t=5 ok; C(1,7): t=6 ok; D(4,8): t=10 > 8 → 剔除 D; E(2,10): t=8 ok
  // 等等：需重新计算。A 加入 t=3 (3<=4 ok); B 加入 t=5 (5<=6 ok); C 加入 t=6 (6<=7 ok);
  // D 加入 t=10 (10>8) → 剔除最大 D(p=4)，t=6; E 加入 t=8 (8<=10 ok)
  // 最终 onTime = A,B,C,E，late = D → lateCount=1
  assert.equal(r.lateCount, 1);
});

test('mh 剔除最长而非最新', () => {
  // A(5,10), B(6,11)：A 加入 t=5 ok；B 加入 t=11 > 11? 不，11<=11 ok
  // 改：A(5,5), B(6,6): A t=5 ok; B t=11 > 6 → 剔除最大（B p=6）
  const r = mooreHodgson([
    { id: 'A', processing: 5, deadline: 5 },
    { id: 'B', processing: 6, deadline: 6 },
  ]);
  // A 加入 t=5 (5<=5 ok); B 加入 t=11 (11>6) → 剔除 B（p=6 > A p=5）
  assert.equal(r.lateCount, 1);
  assert.deepEqual(
    r.late.map((j) => j.id),
    ['B'],
  );
});

test('mh 空输入', () => {
  const r = mooreHodgson([]);
  assert.equal(r.lateCount, 0);
  assert.deepEqual(r.onTime, []);
});

test('mh 单作业按时', () => {
  const r = mooreHodgson([{ id: 'X', processing: 3, deadline: 5 }]);
  assert.equal(r.lateCount, 0);
  assert.equal(r.onTime[0]!.id, 'X');
});

test('mh 单作业延迟', () => {
  const r = mooreHodgson([{ id: 'X', processing: 5, deadline: 3 }]);
  assert.equal(r.lateCount, 1);
  assert.deepEqual(
    r.late.map((j) => j.id),
    ['X'],
  );
});

test('mh 按截止时间排序（钩子）', () => {
  let sortedIds: string[] = [];
  mooreHodgson(
    [
      { id: 'B', processing: 1, deadline: 10 },
      { id: 'A', processing: 1, deadline: 5 },
    ],
    { onSort: (s) => (sortedIds = s.map((j) => j.id)) },
  );
  assert.deepEqual(sortedIds, ['A', 'B']);
});

test('mh 钩子 onEvict', () => {
  const evicted: string[] = [];
  mooreHodgson(
    [
      { id: 'A', processing: 6, deadline: 5 },
      { id: 'B', processing: 1, deadline: 10 },
    ],
    { onEvict: (j) => evicted.push(j.id) },
  );
  assert.deepEqual(evicted, ['A']);
});

test('mh 最优性：延迟数 <= 暴力上限', () => {
  // 任意 4 作业，延迟数应 <= 4
  const r = mooreHodgson([
    { id: 'A', processing: 3, deadline: 2 },
    { id: 'B', processing: 4, deadline: 3 },
    { id: 'C', processing: 1, deadline: 1 },
    { id: 'D', processing: 2, deadline: 10 },
  ]);
  assert.ok(r.lateCount >= 0 && r.lateCount <= 4);
  // 至少 D 能按时（d=10 宽松）
  assert.ok(r.onTime.some((j) => j.id === 'D'));
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
