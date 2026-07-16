import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  intervalSchedule,
  activitySelection,
  isNonOverlapping,
} from '../../src/algorithms/design/greedy-design/impl.ts';

test('intervalSchedule 经典样例选 4 个', () => {
  const picked = intervalSchedule([
    { start: 1, end: 4 },
    { start: 3, end: 5 },
    { start: 0, end: 6 },
    { start: 5, end: 7 },
    { start: 3, end: 9 },
    { start: 5, end: 9 },
    { start: 6, end: 10 },
    { start: 8, end: 11 },
    { start: 8, end: 12 },
    { start: 2, end: 14 },
    { start: 12, end: 16 },
  ]);
  assert.equal(picked.length, 4);
  assert.ok(isNonOverlapping(picked));
});

test('intervalSchedule 空输入', () => {
  assert.deepEqual(intervalSchedule([]), []);
});

test('intervalSchedule 单区间', () => {
  assert.deepEqual(intervalSchedule([{ start: 1, end: 2 }]), [{ start: 1, end: 2 }]);
});

test('intervalSchedule 全相交只能选 1', () => {
  const picked = intervalSchedule([
    { start: 1, end: 10 },
    { start: 2, end: 9 },
    { start: 3, end: 8 },
  ]);
  assert.equal(picked.length, 1);
});

test('intervalSchedule 全不相交全选', () => {
  const picked = intervalSchedule([
    { start: 1, end: 2 },
    { start: 2, end: 3 },
    { start: 3, end: 4 },
  ]);
  assert.equal(picked.length, 3);
});

test('intervalSchedule 结果两两不相交', () => {
  const picked = intervalSchedule([
    { start: 1, end: 4 },
    { start: 5, end: 7 },
    { start: 3, end: 6 },
    { start: 8, end: 10 },
  ]);
  assert.ok(isNonOverlapping(picked));
});

test('intervalSchedule 不修改原数组', () => {
  const input = [
    { start: 2, end: 3 },
    { start: 1, end: 2 },
  ];
  const copy = [...input];
  intervalSchedule(input);
  assert.deepEqual(input, copy);
});

test('activitySelection 返回索引', () => {
  const idx = activitySelection([1, 3, 0, 5], [4, 5, 6, 7]);
  // 按 finish 排序后：[1,4](0), [3,5](1), [0,6](2), [5,7](3)
  // 选 [1,4] → lastEnd=4；[3,5] start 3<4 跳；[0,6] 跳；[5,7] start 5>=4 选
  assert.deepEqual(idx, [0, 3]);
});

test('activitySelection 长度不一致抛错', () => {
  assert.throws(() => activitySelection([1, 2], [3]));
});

test('isNonOverlapping 判定', () => {
  assert.equal(
    isNonOverlapping([
      { start: 1, end: 2 },
      { start: 2, end: 3 },
    ]),
    true,
  );
  assert.equal(
    isNonOverlapping([
      { start: 1, end: 3 },
      { start: 2, end: 4 },
    ]),
    false,
  );
});
