import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSpline, evalSpline } from '../../src/algorithms/numerical/num-cubic-spline/impl.ts';

test('三次样条通过节点', () => {
  const xs = [0, 1, 2, 3];
  const ys = [0, 1, 4, 9];
  const s = buildSpline(xs, ys);
  for (let i = 0; i < xs.length; i++) {
    assert.ok(Math.abs(evalSpline(s, xs[i]!) - ys[i]!) < 1e-9);
  }
});

test('三次样条自然边界 M_0 = M_n = 0', () => {
  let M: number[] = [];
  buildSpline([0, 1, 2, 3], [0, 1, 4, 9], { onSolveM: (m) => (M = m) });
  assert.ok(Math.abs(M[0]!) < 1e-9);
  assert.ok(Math.abs(M[M.length - 1]!) < 1e-9);
});

test('三次样条对三次函数精确', () => {
  // y = x³，本身就是三次，自然样条应精确
  const xs = [0, 1, 2, 3, 4];
  const ys = [0, 1, 8, 27, 64];
  const s = buildSpline(xs, ys);
  for (let k = 0; k <= 40; k++) {
    const x = k / 10;
    assert.ok(Math.abs(evalSpline(s, x) - x * x * x) < 1e-6, `x=${x}`);
  }
});

test('三次样条 C² 连续（一阶导连续）', () => {
  const xs = [0, 1, 2, 3];
  const ys = [0, 1, 4, 9];
  const s = buildSpline(xs, ys);
  // 在 x=1 处，从左 (h=0.0001) 和从右的导数应一致
  const h = 1e-5;
  const dLeft = (evalSpline(s, 1) - evalSpline(s, 1 - h)) / h;
  const dRight = (evalSpline(s, 1 + h) - evalSpline(s, 1)) / h;
  assert.ok(Math.abs(dLeft - dRight) < 1e-3);
});

test('节点必须升序', () => {
  assert.throws(() => buildSpline([1, 0], [1, 0]), RangeError);
});

test('至少 2 个节点', () => {
  assert.throws(() => buildSpline([1], [1]), RangeError);
});

test('evalSpline 越界抛错', () => {
  const s = buildSpline([0, 1, 2], [0, 1, 4]);
  assert.throws(() => evalSpline(s, -0.1), RangeError);
  assert.throws(() => evalSpline(s, 2.1), RangeError);
});
