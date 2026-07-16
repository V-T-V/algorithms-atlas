import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  intervalScheduling,
  greedyReference,
  type IntervalInput,
} from '../../src/algorithms/network/interval-scheduling-network/impl.ts';
import { buildTrace } from '../../src/algorithms/network/interval-scheduling-network/trace.ts';

test('isn 空输入返回 0', () => {
  const sel = intervalScheduling([], 1);
  assert.equal(sel.length, 0);
});

test('isn k=1 与贪心解一致（不重叠集合）', () => {
  const intervals: IntervalInput[] = [
    { start: 0, end: 2 },
    { start: 2, end: 4 },
    { start: 4, end: 6 },
  ];
  const sel = intervalScheduling(intervals, 1);
  const greedy = greedyReference(intervals, 1);
  assert.ok(greedy > 0);
  assert.equal(sel.length, greedy);
});

test('isn k=1 与贪心解一致（重叠集合）', () => {
  const intervals: IntervalInput[] = [
    { start: 0, end: 3 },
    { start: 1, end: 4 },
    { start: 2, end: 5 },
    { start: 3, end: 6 },
    { start: 4, end: 7 },
  ];
  const sel = intervalScheduling(intervals, 1);
  const greedy = greedyReference(intervals, 1);
  assert.ok(greedy > 0);
  assert.equal(sel.length, greedy);
});

test('isn k>=2 选择的数量不少于 k=1', () => {
  const intervals: IntervalInput[] = [
    { start: 0, end: 3 },
    { start: 1, end: 4 },
    { start: 2, end: 5 },
    { start: 3, end: 6 },
  ];
  const sel1 = intervalScheduling(intervals, 1);
  const sel2 = intervalScheduling(intervals, 2);
  assert.ok(sel2.length >= sel1.length);
  assert.ok(sel2.length >= 2);
});

test('isn k>=max-overlap 可选全部', () => {
  const intervals: IntervalInput[] = [
    { start: 0, end: 5 },
    { start: 1, end: 5 },
    { start: 2, end: 5 },
  ];
  const sel = intervalScheduling(intervals, 3);
  assert.equal(sel.length, 3);
});

test('isn k 限制生效：完全重叠 4 区间 k=2 只选 2', () => {
  const intervals: IntervalInput[] = [
    { start: 0, end: 5 },
    { start: 0, end: 5 },
    { start: 0, end: 5 },
    { start: 0, end: 5 },
  ];
  const sel = intervalScheduling(intervals, 2);
  assert.equal(sel.length, 2);
});

test('isn 选中索引都在合法范围内', () => {
  const intervals: IntervalInput[] = [
    { start: 0, end: 3 },
    { start: 2, end: 5 },
    { start: 4, end: 7 },
    { start: 6, end: 9 },
  ];
  const sel = intervalScheduling(intervals, 2);
  for (const idx of sel) {
    assert.ok(idx >= 0 && idx < intervals.length);
  }
});

test('isn buildTrace 生成非空帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 0);
});

test('isn buildTrace 首末帧有 note', () => {
  const frames = buildTrace();
  const first = frames[0]!;
  const last = frames[frames.length - 1]!;
  assert.ok(first.note);
  assert.ok(last.note);
});

test('isn buildTrace 含建网与增广帧', () => {
  const frames = buildTrace();
  const allZh = frames.map((f) => f.note?.zh ?? '').join('\n');
  assert.ok(allZh.includes('构造流网络'));
  assert.ok(allZh.includes('增广'));
});
