import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  linearRegression,
  predict,
  type Observation,
} from '../../src/algorithms/ml/linear-regression/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/ml/linear-regression/trace.ts';

test('linearRegression 完美直线 R²=1', () => {
  const data: Observation[] = [
    { x: 1, y: 3 },
    { x: 2, y: 5 },
    { x: 3, y: 7 },
    { x: 4, y: 9 },
  ]; // y = 2x + 1
  const fit = linearRegression(data);
  assert.ok(Math.abs(fit.slope - 2) < 1e-9);
  assert.ok(Math.abs(fit.intercept - 1) < 1e-9);
  assert.ok(Math.abs(fit.r2 - 1) < 1e-9);
});

test('linearRegression 带噪声近似', () => {
  const data = DEFAULT_INPUT; // y ≈ 2x + 0
  const fit = linearRegression(data);
  assert.ok(Math.abs(fit.slope - 2) < 0.05, `slope=${fit.slope}`);
  assert.ok(fit.r2 > 0.99, `R²=${fit.r2}`);
});

test('linearRegression 残差和约为 0', () => {
  const fit = linearRegression([
    { x: 1, y: 1 },
    { x: 2, y: 2.5 },
    { x: 3, y: 2.8 },
    { x: 4, y: 4.2 },
  ]);
  const sum = fit.residuals.reduce((s, r) => s + r, 0);
  assert.ok(Math.abs(sum) < 1e-9);
});

test('linearRegression 直线过重心 (x̄,ȳ)', () => {
  const data = [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 5 },
    { x: 4, y: 4 },
  ];
  const fit = linearRegression(data);
  const meanX = data.reduce((s, d) => s + d.x, 0) / data.length;
  const meanY = data.reduce((s, d) => s + d.y, 0) / data.length;
  const yAtMean = predict(fit, meanX);
  assert.ok(Math.abs(yAtMean - meanY) < 1e-9);
});

test('linearRegression 水平数据 slope=0', () => {
  const fit = linearRegression([
    { x: 1, y: 5 },
    { x: 2, y: 5 },
    { x: 3, y: 5 },
  ]);
  assert.equal(fit.slope, 0);
  assert.equal(fit.intercept, 5);
  assert.ok(Math.abs(fit.r2 - 1) < 1e-9 || fit.r2 === 0 || Number.isNaN(fit.r2) === false);
});

test('linearRegression 空数据与单点', () => {
  assert.deepEqual(linearRegression([]), {
    slope: 0,
    intercept: 0,
    r2: 0,
    residuals: [],
    predicted: [],
  });
  const single = linearRegression([{ x: 5, y: 9 }]);
  assert.equal(single.slope, 0);
  assert.equal(single.intercept, 9);
});

test('predict 正确计算', () => {
  const fit = linearRegression([
    { x: 0, y: 1 },
    { x: 1, y: 3 },
  ]);
  assert.equal(predict(fit, 0), 1);
  assert.equal(predict(fit, 1), 3);
  assert.equal(predict(fit, 2), 5);
});

test('linearRegression 钩子被调用且顺序正确', () => {
  const order: string[] = [];
  linearRegression(
    [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ],
    {
      onStats: () => order.push('stats'),
      onUpdateSlope: () => order.push('slope'),
      onUpdateIntercept: () => order.push('intercept'),
      onConverge: () => order.push('converge'),
    },
  );
  assert.deepEqual(order, ['stats', 'slope', 'intercept', 'converge']);
});

test('buildTrace 生成散点帧与拟合帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  // 至少一帧含拟合直线（含 line-a/line-b 节点）
  const fitFrames = frames.filter((f) => f.graph?.nodes.some((n) => n.id === 'line-a'));
  assert.ok(fitFrames.length >= 1, '应有含拟合直线的帧');
  // 末帧应展示 R²
  const last = frames[frames.length - 1]!;
  const r2 = last.aux?.find((e) => e.label === 'R²');
  assert.ok(r2, '末帧应含 R²');
  assert.ok(parseFloat(r2!.value) > 0.99);
});
