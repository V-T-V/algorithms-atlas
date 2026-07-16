import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  intervalScheduling,
  isNonOverlapping,
} from '../../src/algorithms/scheduling/interval-scheduling/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/scheduling/interval-scheduling/trace.ts';

test('interval CLRS 经典示例选 4 个', () => {
  const r = intervalScheduling(DEFAULT_INPUT);
  // 经典活动选择结果 = 4（A,D,I,K 或类似）
  assert.equal(r.length, 4);
});

test('interval 选中区间两两不重叠', () => {
  const r = intervalScheduling(DEFAULT_INPUT);
  assert.ok(isNonOverlapping(r));
});

test('interval 单区间直接选', () => {
  const r = intervalScheduling([{ start: 1, finish: 3 }]);
  assert.equal(r.length, 1);
});

test('interval 全重叠只选 1 个', () => {
  const r = intervalScheduling([
    { start: 1, finish: 10 },
    { start: 2, finish: 9 },
    { start: 3, finish: 8 },
  ]);
  assert.equal(r.length, 1);
  // 应选结束最早的（finish=8）
  assert.equal(r[0]!.finish, 8);
});

test('interval 不相连区间全选', () => {
  const r = intervalScheduling([
    { start: 1, finish: 2 },
    { start: 3, finish: 4 },
    { start: 5, finish: 6 },
  ]);
  assert.equal(r.length, 3);
});

test('interval 空输入', () => {
  assert.deepEqual(intervalScheduling([]), []);
});

test('interval 按结束时间排序后选', () => {
  const r = intervalScheduling([
    { start: 0, finish: 6, id: 'long' },
    { start: 1, finish: 2, id: 'short1' },
    { start: 2, finish: 3, id: 'short2' },
  ]);
  // 选结束最早的 short1, short2（long 因重叠被跳过）
  assert.equal(r.length, 2);
  assert.deepEqual(
    r.map((x) => x.id),
    ['short1', 'short2'],
  );
});

test('interval 钩子 onConsider', () => {
  const decisions: boolean[] = [];
  intervalScheduling(
    [
      { start: 1, finish: 3 },
      { start: 2, finish: 4 },
      { start: 3, finish: 5 },
    ],
    { onConsider: (_it, _le, sel) => decisions.push(sel) },
  );
  // 排序后 [1-3, 2-4, 3-5]：选 1-3，跳 2-4，选 3-5
  assert.deepEqual(decisions, [true, false, true]);
});

test('interval 相邻区间（finish=start）可同时选', () => {
  const r = intervalScheduling([
    { start: 1, finish: 2 },
    { start: 2, finish: 3 },
    { start: 3, finish: 4 },
  ]);
  assert.equal(r.length, 3);
});

test('interval 最大化数量（贪心最优）', () => {
  // 一个手工小例：[1-3],[2-5],[4-6],[3-7] → 最优 2（[1-3] 和 [4-6]）
  const r = intervalScheduling([
    { start: 1, finish: 3 },
    { start: 2, finish: 5 },
    { start: 4, finish: 6 },
    { start: 3, finish: 7 },
  ]);
  assert.equal(r.length, 2);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
