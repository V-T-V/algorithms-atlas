import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ridgeRegression, predict } from '../../src/algorithms/numerical/ridge-regression/impl.ts';

const close = (a: number, b: number, eps = 1e-4): boolean => Math.abs(a - b) < eps;

test('ridgeRegression: 无噪声线性数据精确还原', () => {
  // y = 2 + 3x
  const X = [[1], [2], [3], [4], [5]];
  const y = [5, 8, 11, 14, 17];
  const model = ridgeRegression(X, y, 0.01, true);
  assert.ok(close(model.intercept, 2, 1e-2), `intercept=${model.intercept}`);
  assert.ok(close(model.coefficients[0]!, 3, 1e-2));
});

test('ridgeRegression: λ 增大 → 系数收缩', () => {
  const X = [[1], [2], [3], [4], [5]];
  const y = [5, 8, 11, 14, 17];
  const small = ridgeRegression(X, y, 0.001);
  const large = ridgeRegression(X, y, 10);
  // 大 λ 下斜率被压缩
  assert.ok(Math.abs(large.coefficients[0]!) < Math.abs(small.coefficients[0]!));
});

test('ridgeRegression: 多特征（2D 线性）', () => {
  // y = 1 + 2x1 + 3x2
  const X = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 3],
    [3, 1],
  ];
  const y = [1, 3, 4, 6, 14, 10];
  const model = ridgeRegression(X, y, 0.001);
  assert.ok(close(model.intercept, 1, 1e-2));
  assert.ok(close(model.coefficients[0]!, 2, 1e-2));
  assert.ok(close(model.coefficients[1]!, 3, 1e-2));
});

test('ridgeRegression: fitIntercept=false 不中心化', () => {
  const X = [[1], [2], [3]];
  const y = [3, 6, 9]; // y=3x，过原点
  const model = ridgeRegression(X, y, 0.001, false);
  assert.ok(close(model.intercept, 0, 1e-9));
  assert.ok(close(model.coefficients[0]!, 3, 1e-2));
});

test('ridgeRegression: 预测与训练数据一致', () => {
  const X = [[1], [2], [3], [4]];
  const y = [2, 4, 6, 8];
  const model = ridgeRegression(X, y, 0.001);
  const preds = predict(model, X);
  for (let i = 0; i < y.length; i++) assert.ok(close(preds[i]!, y[i]!, 1e-2));
});

test('ridgeRegression: λ=0 退化为普通最小二乘', () => {
  const X = [[1], [2], [3], [4], [5]];
  const y = [3, 5, 7, 9, 11]; // y = 1 + 2x
  const model = ridgeRegression(X, y, 0, true);
  assert.ok(close(model.intercept, 1, 1e-6));
  assert.ok(close(model.coefficients[0]!, 2, 1e-6));
});

test('ridgeRegression: hooks 正确回调', () => {
  let normalEq: unknown = null;
  let done: unknown = null;
  ridgeRegression([[1], [2], [3]], [2, 4, 6], 0.1, true, {
    onNormalEquation: (m, v) => (normalEq = { m, v }),
    onDone: (r) => (done = r),
  });
  assert.ok(normalEq !== null);
  assert.ok(done !== null);
});

test('ridgeRegression: 非法入参抛错', () => {
  assert.throws(() => ridgeRegression([], [], 1), RangeError);
  assert.throws(() => ridgeRegression([[1], [2]], [1, 2, 3], 1), RangeError);
  assert.throws(() => ridgeRegression([[1]], [1], -1), RangeError);
});
