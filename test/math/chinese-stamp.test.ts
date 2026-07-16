import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chineseStamp, type Edge } from '../../src/algorithms/math/chinese-stamp/impl.ts';

/** 校验 tour 合法性：首尾相同、每条原图边至少被覆盖一次。 */
function assertValidTour(V: number, edges: readonly Edge[], tour: number[]): void {
  assert.ok(tour.length >= 1, 'tour 非空');
  assert.equal(tour[0], tour[tour.length - 1], '首尾相同');
  // 统计 tour 中相邻 (a,b) 的覆盖次数
  const cover = new Map<string, number>();
  const key = (a: number, b: number): string => (a < b ? `${a}-${b}` : `${b}-${a}`);
  for (let i = 0; i + 1 < tour.length; i++) {
    const k = key(tour[i]!, tour[i + 1]!);
    cover.set(k, (cover.get(k) ?? 0) + 1);
  }
  for (const e of edges) {
    assert.ok((cover.get(key(e.u, e.v)) ?? 0) >= 1, `边 ${e.u}-${e.v} 至少被走一次`);
  }
  void V;
}

test('chinese-stamp 欧拉图：无需重复', () => {
  // 三角形（每点度数均为偶或恰好两个奇？三角形每点度数 2 → 欧拉图）
  const edges: Edge[] = [
    { u: 0, v: 1, w: 1 },
    { u: 1, v: 2, w: 2 },
    { u: 2, v: 0, w: 3 },
  ];
  const r = chineseStamp(3, edges);
  assert.equal(r.totalWeight, 6);
  assert.equal(r.addedWeight, 0, '欧拉图无需重复');
  assert.equal(r.routeLength, 6);
  assertValidTour(3, edges, r.tour);
});

test('chinese-stamp 单条边', () => {
  const edges: Edge[] = [{ u: 0, v: 1, w: 5 }];
  const r = chineseStamp(2, edges);
  assert.equal(r.totalWeight, 5);
  assert.equal(r.routeLength, 10, '必须来回走 → 2*5');
  assertValidTour(2, edges, r.tour);
});

test('chinese-stamp 正方形 + 对角线', () => {
  const edges: Edge[] = [
    { u: 0, v: 1, w: 1 },
    { u: 1, v: 2, w: 2 },
    { u: 2, v: 3, w: 1 },
    { u: 3, v: 0, w: 2 },
    { u: 0, v: 2, w: 4 },
  ];
  // 度数：0→3, 1→2, 2→3, 3→2 → 奇度点 {0,2}
  // 0 到 2 最短路 = min(0-2 直边 4, 0-1-2=3, 0-3-2=3) = 3
  // 故重复代价 = 3，总长度 = (1+2+1+2+4) + 3 = 13
  const r = chineseStamp(4, edges);
  assert.equal(r.totalWeight, 10);
  assert.equal(r.addedWeight, 3);
  assert.equal(r.routeLength, 13);
  assertValidTour(4, edges, r.tour);
});

test('chinese-stamp K4（每点度数 3，全部奇度点）', () => {
  const edges: Edge[] = [
    { u: 0, v: 1, w: 1 },
    { u: 0, v: 2, w: 1 },
    { u: 0, v: 3, w: 1 },
    { u: 1, v: 2, w: 1 },
    { u: 1, v: 3, w: 1 },
    { u: 2, v: 3, w: 1 },
  ];
  // 4 个奇度点 0,1,2,3；最短配对为两两直连，每条代价 1 → 共 2
  const r = chineseStamp(4, edges);
  assert.equal(r.totalWeight, 6);
  assert.equal(r.addedWeight, 2);
  assert.equal(r.routeLength, 8);
  assertValidTour(4, edges, r.tour);
});

test('chinese-stamp tour 长度等于边数+重复数', () => {
  const edges: Edge[] = [
    { u: 0, v: 1, w: 2 },
    { u: 1, v: 2, w: 3 },
    { u: 2, v: 0, w: 1 },
  ];
  const r = chineseStamp(3, edges, {});
  // 欧拉图 → tour 顶点数 = 边数 + 1
  assert.equal(r.tour.length, edges.length + 1);
});

test('chinese-stamp 拒绝越界端点', () => {
  assert.throws(() => chineseStamp(2, [{ u: 0, v: 5, w: 1 }]), RangeError);
  assert.throws(() => chineseStamp(-1, []), RangeError);
});

test('chinese-stamp 钩子被调用', () => {
  let odds = 0;
  let ap = 0;
  let match = 0;
  let euler = 0;
  let done = 0;
  chineseStamp(
    4,
    [
      { u: 0, v: 1, w: 1 },
      { u: 1, v: 2, w: 1 },
      { u: 2, v: 3, w: 1 },
      { u: 3, v: 0, w: 1 },
    ],
    {
      onOddVertices: () => odds++,
      onAllPairs: () => ap++,
      onMatching: () => match++,
      onEulerTour: () => euler++,
      onDone: () => done++,
    },
  );
  assert.equal(odds, 1);
  assert.equal(ap, 1);
  assert.equal(match, 1);
  assert.equal(euler, 1);
  assert.equal(done, 1);
});
