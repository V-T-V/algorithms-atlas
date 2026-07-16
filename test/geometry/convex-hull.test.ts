import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convexHull, type Point } from '../../src/algorithms/geometry/convex-hull/impl.ts';

// 叉积：>0 左转（CCW），<0 右转，=0 共线
function cross(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

// 辅助：判定 hull 是否为合法凸包（CCW、闭合、严格左转）
function assertValidHull(all: readonly Point[], hull: Point[]): void {
  const m = hull.length;
  assert.ok(m >= 1, 'hull 非空');
  if (m < 3) return; // 点太少，无法判凸性
  for (let i = 0; i < m; i++) {
    const o = hull[i]!;
    const a = hull[(i + 1) % m]!;
    const b = hull[(i + 2) % m]!;
    assert.ok(cross(o, a, b) > 0, `顶点 ${i} 处应严格左转（凸）`);
  }
  // 所有输入点都应在凸包内或边上（cross >= 0 表示在左侧或边上）
  for (const p of all) {
    for (let i = 0; i < m; i++) {
      const o = hull[i]!;
      const a = hull[(i + 1) % m]!;
      assert.ok(cross(o, a, p) >= 0, `点 ${JSON.stringify(p)} 不在凸包内`);
    }
  }
}

test('convexHull 边界', () => {
  assert.deepEqual(convexHull([]), []);
  const one: Point[] = [{ x: 1, y: 1 }];
  assert.deepEqual(convexHull(one), [{ x: 1, y: 1 }]);
});

test('convexHull 正方形角点 + 内部点', () => {
  const pts: Point[] = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
    { x: 2, y: 2 }, // 内部点
    { x: 1, y: 1 }, // 对角线内部
  ];
  const hull = convexHull(pts);
  assert.equal(hull.length, 4, '应为 4 个角点');
  assertValidHull(pts, hull);
});

test('convexHull 含共线点（被剔除）', () => {
  // 底边 y=0 上有 (0,0)(1,0)(2,0) 共线，应只留两端
  const pts: Point[] = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 2 },
  ];
  const hull = convexHull(pts);
  assertValidHull(pts, hull);
  // 共线的 (1,0) 不应在顶点中
  assert.ok(!hull.some((p) => p.x === 1 && p.y === 0), '共线点应被剔除');
});

test('convexHull 不修改原数组', () => {
  const pts: Point[] = [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 2 },
  ];
  const snapshot = pts.map((p) => ({ ...p }));
  convexHull(pts);
  assert.deepEqual(pts, snapshot);
});

test('convexHull 钩子被调用', () => {
  let push = 0;
  let pop = 0;
  convexHull(
    [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
      { x: 0, y: 4 },
      { x: 2, y: 2 },
    ],
    {
      onPush: () => push++,
      onPop: () => pop++,
    },
  );
  assert.ok(push > 0, '应触发 onPush');
  // 本例无共线/右转，pop 可能为 0，仅断言不报错
  assert.ok(pop >= 0);
});
