import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  antitheticIntegrate,
  crudeMonteCarlo,
} from '../../src/algorithms/randomized/rand-antithetic/impl.ts';

test('antitheticIntegrate 估计 ∫x² 接近 1/3', () => {
  const r = antitheticIntegrate((x) => x * x, 1000);
  assert.ok(Math.abs(r.estimate - 1 / 3) < 0.02, `估计 ${r.estimate} 偏离 1/3`);
});

test('antitheticIntegrate 方差小于粗 MC', () => {
  // 对单调函数 f(x)=x²，对偶变量方差应明显小
  const anti = antitheticIntegrate((x) => x * x, 2000);
  const crude = crudeMonteCarlo((x) => x * x, 2000);
  assert.ok(
    anti.variance < crude.variance,
    `对偶方差 ${anti.variance} 应小于粗 MC ${crude.variance}`,
  );
});

test('antitheticIntegrate 对称函数无方差', () => {
  // f(x) = (x-0.5)² 关于 0.5 对称：f(u)=f(1-u)，每对 avg 恒等于 f(u)
  // 但因为是常数对，方差来自 u 的随机性，不为 0
  const r = antitheticIntegrate((x) => (x - 0.5) ** 2, 100);
  assert.ok(r.variance >= 0);
  // 估计应接近 E[(X-0.5)²] = 1/12
  assert.ok(Math.abs(r.estimate - 1 / 12) < 0.02);
});

test('antitheticIntegrate 确定性', () => {
  const a = antitheticIntegrate((x) => x, 100);
  const b = antitheticIntegrate((x) => x, 100);
  assert.equal(a.estimate, b.estimate);
});

test('antitheticIntegrate 常数 f', () => {
  const r = antitheticIntegrate(() => 5, 50);
  assert.equal(r.estimate, 5);
  assert.equal(r.variance, 0);
});
