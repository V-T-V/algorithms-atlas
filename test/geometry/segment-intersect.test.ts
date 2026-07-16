import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  segmentIntersect,
  cross,
  type Point,
  type Segment,
} from '../../src/algorithms/geometry/segment-intersect/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/geometry/segment-intersect/trace.ts';

function seg(a: Point, b: Point): Segment {
  return { p: a, q: b };
}

test('segment-intersect 规范相交（X 形）', () => {
  const s1 = seg({ x: 0, y: 0 }, { x: 4, y: 4 });
  const s2 = seg({ x: 0, y: 4 }, { x: 4, y: 0 });
  const r = segmentIntersect(s1, s2);
  assert.equal(r.intersects, true);
  assert.equal(r.proper, true);
});

test('segment-intersect 不相交（平行分离）', () => {
  const s1 = seg({ x: 0, y: 0 }, { x: 4, y: 0 });
  const s2 = seg({ x: 0, y: 2 }, { x: 4, y: 2 });
  const r = segmentIntersect(s1, s2);
  assert.equal(r.intersects, false);
  assert.equal(r.proper, false);
});

test('segment-intersect 不相交（T 形错开）', () => {
  const s1 = seg({ x: 0, y: 0 }, { x: 4, y: 0 });
  const s2 = seg({ x: 5, y: -2 }, { x: 5, y: 2 });
  const r = segmentIntersect(s1, s2);
  assert.equal(r.intersects, false);
});

test('segment-intersect 端点相接（广义相交，非规范）', () => {
  // s2 的端点 p3 = s1 的端点 p2
  const s1 = seg({ x: 0, y: 0 }, { x: 2, y: 0 });
  const s2 = seg({ x: 2, y: 0 }, { x: 2, y: 3 });
  const r = segmentIntersect(s1, s2);
  assert.equal(r.intersects, true);
  assert.equal(r.proper, false, '端点相接不是规范相交');
});

test('segment-intersect 共线重叠（广义相交）', () => {
  const s1 = seg({ x: 0, y: 0 }, { x: 4, y: 0 });
  const s2 = seg({ x: 2, y: 0 }, { x: 6, y: 0 });
  const r = segmentIntersect(s1, s2);
  assert.equal(r.intersects, true);
  assert.equal(r.proper, false);
});

test('segment-intersect 共线但不重叠（不相交）', () => {
  const s1 = seg({ x: 0, y: 0 }, { x: 2, y: 0 });
  const s2 = seg({ x: 3, y: 0 }, { x: 5, y: 0 });
  const r = segmentIntersect(s1, s2);
  assert.equal(r.intersects, false);
});

test('segment-intersect cross 函数符号正确', () => {
  // (1,0) × (0,1) 相对原点 = 1*1 - 0*0 = 1 > 0（左转）
  assert.ok(cross({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }) > 0);
  // 右转 < 0
  assert.ok(cross({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }) < 0);
  // 共线 = 0
  assert.equal(cross({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }), 0);
});

test('segment-intersect 钩子被调用', () => {
  const crosses: number[] = [];
  let resultCalled = false;
  segmentIntersect(seg({ x: 0, y: 0 }, { x: 4, y: 4 }), seg({ x: 0, y: 4 }, { x: 4, y: 0 }), {
    onCross: (_a, _b, _c, v) => crosses.push(v),
    onResult: () => (resultCalled = true),
  });
  // 四次方向计算
  assert.equal(crosses.length, 4);
  assert.equal(resultCalled, true);
});

test('segment-intersect 一端点在线段上但非端点（广义相交）', () => {
  // s2 的端点 p3 落在 s1 内部
  const s1 = seg({ x: 0, y: 0 }, { x: 4, y: 0 });
  const s2 = seg({ x: 2, y: 0 }, { x: 2, y: 3 });
  const r = segmentIntersect(s1, s2);
  assert.equal(r.intersects, true);
  assert.equal(r.proper, false);
});

test('buildTrace 含 graph 与 aux，末帧角色正确', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const first = frames[0]!;
  assert.ok(first.graph, '首帧含 graph');
  assert.ok(first.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  assert.ok(last.graph);
  // X 形规范相交 → 末帧边 role 应为 final
  assert.ok(
    last.graph!.edges.some((e) => e.role === 'final'),
    '相交时末帧边应为 final',
  );
});
