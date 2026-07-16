// 平面扫描线（通用框架）· 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sweepIntervalUnion,
  sweepRectUnionArea,
  type Rect,
} from '../../src/algorithms/geometry/plane-sweep/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/geometry/plane-sweep/trace.ts';

test('区间并集：无重叠', () => {
  const r = sweepIntervalUnion([
    { l: 1, r: 2 },
    { l: 3, r: 5 },
  ]);
  assert.equal(r, 3);
});

test('区间并集：完全重叠', () => {
  const r = sweepIntervalUnion([
    { l: 1, r: 5 },
    { l: 2, r: 4 },
  ]);
  assert.equal(r, 4);
});

test('区间并集：部分重叠', () => {
  const r = sweepIntervalUnion([
    { l: 1, r: 4 },
    { l: 3, r: 6 },
  ]);
  assert.equal(r, 5); // [1,6]
});

test('区间并集：DEFAULT_INPUT', () => {
  // [1,4]∪[2,5]∪[3,6]=[1,6]（长 5）；[7,9]∪[8,10]=[7,10]（长 3）；总 8
  const r = sweepIntervalUnion(DEFAULT_INPUT.intervals);
  assert.equal(r, 8);
});

test('区间并集：空列表', () => {
  assert.equal(sweepIntervalUnion([]), 0);
});

test('区间并集：退化区间被跳过', () => {
  assert.equal(
    sweepIntervalUnion([
      { l: 2, r: 2 },
      { l: 1, r: 3 },
    ]),
    2,
  );
});

test('矩形并集面积：无重叠', () => {
  const rects: Rect[] = [
    { x1: 0, y1: 0, x2: 2, y2: 2 },
    { x1: 5, y1: 5, x2: 7, y2: 7 },
  ];
  assert.equal(sweepRectUnionArea(rects), 8);
});

test('矩形并集面积：完全重叠', () => {
  const rects: Rect[] = [
    { x1: 0, y1: 0, x2: 4, y2: 4 },
    { x1: 1, y1: 1, x2: 3, y2: 3 },
  ];
  assert.equal(sweepRectUnionArea(rects), 16);
});

test('矩形并集面积：部分重叠', () => {
  // 两个 4×4 矩形，重叠 2×2：16+16−4=28
  const rects: Rect[] = [
    { x1: 0, y1: 0, x2: 4, y2: 4 },
    { x1: 2, y1: 2, x2: 6, y2: 6 },
  ];
  assert.equal(sweepRectUnionArea(rects), 28);
});

test('矩形并集面积：空', () => {
  assert.equal(sweepRectUnionArea([]), 0);
});

test('钩子触发（区间）', () => {
  const events: number[] = [];
  sweepIntervalUnion(
    [
      { l: 1, r: 3 },
      { l: 2, r: 4 },
    ],
    {
      onEvent: (x) => events.push(x),
    },
  );
  assert.ok(events.length >= 1);
  // 4 个端点
  assert.equal(events.length, 4);
});

test('钩子触发（矩形）', () => {
  let done: number | null = null;
  const cnt: number[] = [];
  sweepRectUnionArea(
    [
      { x1: 0, y1: 0, x2: 2, y2: 2 },
      { x1: 1, y1: 1, x2: 3, y2: 3 },
    ],
    {
      onEvent: (_x, c) => cnt.push(c),
      onDone: (a) => (done = a),
    },
  );
  assert.ok(cnt.length >= 1);
  assert.ok(done !== null && done > 0);
});

test('buildTrace 生成至少 4 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
  for (const f of frames) {
    assert.ok(f.aux === undefined || Array.isArray(f.aux));
  }
});

test('DEFAULT_INPUT.intervals 长度为 5', () => {
  assert.equal(DEFAULT_INPUT.intervals.length, 5);
});
