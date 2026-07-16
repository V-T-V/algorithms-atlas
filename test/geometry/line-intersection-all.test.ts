// 所有线段交点（Bentley-Ottmann）· 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  findAllIntersections,
  type Segment,
  type Point,
} from '../../src/algorithms/geometry/line-intersection-all/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/geometry/line-intersection-all/trace.ts';

/** 朴素 O(n²) 参考：枚举所有线段对。 */
function bruteIntersections(segments: Segment[]): Array<{ point: Point; i: number; j: number }> {
  const out: Array<{ point: Point; i: number; j: number }> = [];
  const cross = (a: Point, b: Point, c: Point) =>
    (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  for (let a = 0; a < segments.length; a++) {
    for (let b = a + 1; b < segments.length; b++) {
      const p1 = segments[a]!.p,
        q1 = segments[a]!.q;
      const p2 = segments[b]!.p,
        q2 = segments[b]!.q;
      const d1 = cross(p2, q2, p1);
      const d2 = cross(p2, q2, q1);
      const d3 = cross(p1, q1, p2);
      const d4 = cross(p1, q1, q2);
      if (
        ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
        ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
      ) {
        const t = d1 / (d1 - d2);
        out.push({
          point: { x: p1.x + t * (q1.x - p1.x), y: p1.y + t * (q1.y - p1.y) },
          i: a,
          j: b,
        });
      }
    }
  }
  return out;
}

test('两条交叉线段：1 个交点', () => {
  const segs: Segment[] = [
    { p: { x: 0, y: 0 }, q: { x: 4, y: 4 } },
    { p: { x: 0, y: 4 }, q: { x: 4, y: 0 } },
  ];
  const r = findAllIntersections(segs);
  assert.equal(r.length, 1);
  assert.ok(Math.abs(r[0]!.point.x - 2) < 1e-9);
  assert.ok(Math.abs(r[0]!.point.y - 2) < 1e-9);
});

test('两条不相交线段：0 个交点', () => {
  const segs: Segment[] = [
    { p: { x: 0, y: 0 }, q: { x: 2, y: 2 } },
    { p: { x: 5, y: 5 }, q: { x: 7, y: 7 } },
  ];
  assert.equal(findAllIntersections(segs).length, 0);
});

test('DEFAULT_INPUT 与朴素一致（交点数）', () => {
  const r = findAllIntersections(DEFAULT_INPUT.segments);
  const ref = bruteIntersections(DEFAULT_INPUT.segments);
  assert.equal(r.length, ref.length, `${r.length} vs ${ref.length}`);
});

test('DEFAULT_INPUT 交点坐标与朴素一致', () => {
  const r = findAllIntersections(DEFAULT_INPUT.segments);
  const ref = bruteIntersections(DEFAULT_INPUT.segments);
  for (const a of r) {
    const match = ref.find(
      (b) => Math.abs(b.point.x - a.point.x) < 1e-6 && Math.abs(b.point.y - a.point.y) < 1e-6,
    );
    assert.ok(match, `交点 (${a.point.x},${a.point.y}) 在参考中无对应`);
  }
});

test('多条平行线段：0 交点', () => {
  const segs: Segment[] = [
    { p: { x: 0, y: 1 }, q: { x: 5, y: 1 } },
    { p: { x: 0, y: 2 }, q: { x: 5, y: 2 } },
    { p: { x: 0, y: 3 }, q: { x: 5, y: 3 } },
  ];
  assert.equal(findAllIntersections(segs).length, 0);
});

test('共享端点不算规范相交', () => {
  // 两线段共享端点 (2,2)，但规范相交要求内部相交
  const segs: Segment[] = [
    { p: { x: 0, y: 0 }, q: { x: 2, y: 2 } },
    { p: { x: 2, y: 2 }, q: { x: 4, y: 0 } },
  ];
  assert.equal(findAllIntersections(segs).length, 0);
});

test('星形多条线段交于中心', () => {
  const segs: Segment[] = [
    { p: { x: 0, y: 0 }, q: { x: 10, y: 10 } },
    { p: { x: 0, y: 10 }, q: { x: 10, y: 0 } },
    { p: { x: 5, y: 0 }, q: { x: 5, y: 10 } },
    { p: { x: 0, y: 5 }, q: { x: 10, y: 5 } },
  ];
  const r = findAllIntersections(segs);
  // 中心 (5,5) 是多对相交点；不同对：(0,1),(0,2),(0,3),(1,2),(1,3),(2,3) 全都交于 (5,5)
  assert.equal(r.length, 6);
});

test('空线段列表', () => {
  assert.equal(findAllIntersections([]).length, 0);
});

test('单条线段无交点', () => {
  assert.equal(findAllIntersections([{ p: { x: 0, y: 0 }, q: { x: 1, y: 1 } }]).length, 0);
});

test('随机线段：与朴素交点数一致', () => {
  const segs: Segment[] = [];
  for (let i = 0; i < 12; i++) {
    segs.push({
      p: { x: (i * 7) % 10, y: (i * 11) % 10 },
      q: { x: (i * 13) % 10, y: (i * 3) % 10 },
    });
  }
  const r = findAllIntersections(segs);
  const ref = bruteIntersections(segs);
  assert.equal(r.length, ref.length, `${r.length} vs ${ref.length}`);
});

test('钩子触发', () => {
  const endpoints: number[] = [];
  const inters: number[] = [];
  findAllIntersections(DEFAULT_INPUT.segments, {
    onEndpoint: (idx) => endpoints.push(idx),
    onIntersection: (ip) => inters.push(ip.i),
  });
  assert.ok(endpoints.length >= 1);
  // DEFAULT_INPUT 至少有一些交点
  assert.ok(inters.length >= 1);
});

test('buildTrace 生成至少 4 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
  for (const f of frames) {
    assert.ok(f.aux === undefined || Array.isArray(f.aux));
  }
});

test('DEFAULT_INPUT.segments 长度为 4', () => {
  assert.equal(DEFAULT_INPUT.segments.length, 4);
});
