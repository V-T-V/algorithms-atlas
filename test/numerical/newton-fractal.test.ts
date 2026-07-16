import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  newtonIterate,
  newtonFractal,
  unitRoots,
  type Complex,
} from '../../src/algorithms/numerical/newton-fractal/impl.ts';

const close = (a: number, b: number, eps = 1e-4): boolean => Math.abs(a - b) < eps;
const cClose = (a: Complex, b: Complex, eps = 1e-4): boolean =>
  close(a.re, b.re, eps) && close(a.im, b.im, eps);

test('unitRoots: z³−1 的三个根', () => {
  const roots = unitRoots(3);
  assert.equal(roots.length, 3);
  assert.ok(cClose(roots[0]!, { re: 1, im: 0 }));
  // 每个 root 的 3 次方 = 1
  for (const r of roots) {
    const cube = { re: r.re ** 3 - 3 * r.re * r.im ** 2, im: 3 * r.re ** 2 * r.im - r.im ** 3 };
    assert.ok(cClose(cube, { re: 1, im: 0 }, 1e-9));
  }
});

test('newtonIterate: 起点靠近根 1 → 收敛到根 0', () => {
  const roots = unitRoots(3);
  const r = newtonIterate({ re: 1.2, im: 0.1 }, 3, roots);
  assert.equal(r.converged, true);
  assert.equal(r.rootIndex, 0);
});

test('newtonIterate: 起点靠近第二根 → 收敛到根 1', () => {
  const roots = unitRoots(3);
  const seed = { re: roots[1]!.re + 0.05, im: roots[1]!.im + 0.05 };
  const r = newtonIterate(seed, 3, roots);
  assert.equal(r.converged, true);
  assert.equal(r.rootIndex, 1);
});

test("newtonIterate: z=0 不收敛（f'=0）", () => {
  const roots = unitRoots(3);
  const r = newtonIterate({ re: 0, im: 0 }, 3, roots, 10);
  // z=0 时 f'(0)=0，除零得到 NaN，迭代发散
  assert.equal(r.converged, false);
});

test('newtonFractal: 网格尺寸正确', () => {
  const grid = newtonFractal(3, -2, 2, -2, 2, 5, 4);
  assert.equal(grid.length, 4);
  assert.equal(grid[0]!.length, 5);
});

test('newtonFractal: 网格四角中至少部分收敛', () => {
  const grid = newtonFractal(3, -2, 2, -2, 2, 10, 10);
  let converged = 0;
  for (const row of grid) for (const p of row) if (p.converged) converged++;
  // 大多数点应收敛
  assert.ok(converged > 50);
});

test('newtonFractal: degree=1（z−1）所有点收敛到唯一根', () => {
  const grid = newtonFractal(1, -1, 1, -1, 1, 4, 4);
  for (const row of grid) {
    for (const p of row) {
      if (p.converged) assert.equal(p.rootIndex, 0);
    }
  }
});

test('newtonFractal: hooks 正确回调', () => {
  let points = 0;
  let done = false;
  newtonFractal(3, -1, 1, -1, 1, 3, 3, {
    onPoint: () => points++,
    onDone: () => (done = true),
  });
  assert.equal(points, 9);
  assert.equal(done, true);
});

test('newtonFractal: 非法入参抛错', () => {
  assert.throws(() => newtonFractal(0, -1, 1, -1, 1, 4, 4), RangeError);
  assert.throws(() => newtonFractal(3, -1, 1, -1, 1, 0, 4), RangeError);
});
