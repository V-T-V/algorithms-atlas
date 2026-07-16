import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KDTree, kdTree, type Point } from '../../src/algorithms/ds/kd-tree/impl.ts';

const pts: Point[] = [
  { x: 2, y: 3 },
  { x: 5, y: 4 },
  { x: 9, y: 6 },
  { x: 4, y: 7 },
  { x: 8, y: 1 },
  { x: 7, y: 2 },
  { x: 1, y: 8 },
  { x: 6, y: 5 },
];

test('kd-tree 最近邻与暴力一致', () => {
  const tree = new KDTree(pts);
  const targets: Point[] = [
    { x: 6.5, y: 3.5 },
    { x: 0, y: 0 },
    { x: 10, y: 10 },
    { x: 5, y: 5 },
    { x: 4.9, y: 6.9 },
    { x: 2.1, y: 3.1 },
  ];
  for (const t of targets) {
    const got = tree.nearest(t)!;
    const exp = tree.bruteNearest(t)!;
    assert.equal(got.idx, exp.idx, `target (${t.x},${t.y})`);
    assert.ok(Math.abs(got.dist - exp.dist) < 1e-9, `dist target (${t.x},${t.y})`);
  }
});

test('kd-tree 单点 / 空集', () => {
  const one = new KDTree([{ x: 1, y: 1 }]);
  assert.equal(one.nearest({ x: 100, y: 100 })!.idx, 0);
  const empty = new KDTree([]);
  assert.equal(empty.nearest({ x: 0, y: 0 }), null);
});

test('kd-tree 重合点', () => {
  const tree = new KDTree([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ]);
  const r = tree.nearest({ x: 0, y: 0 })!;
  assert.equal(r.dist, 0);
});

test('kdTree 便利函数', () => {
  const out = kdTree({
    points: pts,
    targets: [
      { x: 6.5, y: 3.5 },
      { x: 0, y: 0 },
    ],
  });
  const tree = new KDTree(pts);
  assert.deepEqual(
    out,
    [
      { x: 6.5, y: 3.5 },
      { x: 0, y: 0 },
    ].map((t) => {
      const r = tree.bruteNearest(t)!;
      return { idx: r.idx, dist: r.dist };
    }),
  );
});

test('kd-tree 钩子被调用', () => {
  let splits = 0;
  let visits = 0;
  let results = 0;
  const tree = new KDTree(pts, { onSplit: () => splits++ });
  assert.ok(splits >= pts.length, '建树应分割所有点');
  tree.nearest(
    { x: 6.5, y: 3.5 },
    {
      onVisit: () => visits++,
      onResult: () => results++,
    },
  );
  assert.ok(visits > 0, '查询应访问节点');
  assert.equal(results, 1);
});
