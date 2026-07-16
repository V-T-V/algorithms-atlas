// 蒙特卡洛积分 · 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  monteCarloIntegrate,
  mulberry32,
} from '../../src/algorithms/randomized/monte-carlo-integration/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/randomized/monte-carlo-integration/trace.ts';

test('∫_0^π sin(x) dx ≈ 2（大样本误差 < 0.15）', () => {
  const { estimate, totalCount } = monteCarloIntegrate(
    Math.sin,
    0,
    Math.PI,
    0,
    1,
    20000,
    mulberry32(42),
  );
  assert.equal(totalCount, 20000);
  assert.ok(Math.abs(estimate - 2) < 0.15, `估计 ${estimate} 偏离 2 过多`);
});

test('∫_0^1 x² dx = 1/3（大样本误差 < 0.05）', () => {
  const { estimate } = monteCarloIntegrate((x) => x * x, 0, 1, 0, 1, 20000, mulberry32(1));
  assert.ok(Math.abs(estimate - 1 / 3) < 0.05, `估计 ${estimate} 偏离 1/3 过多`);
});

test('∫_0^1 1 dx = 1（常数函数）', () => {
  const { estimate, underCount } = monteCarloIntegrate(() => 1, 0, 1, 0, 1, 1000, mulberry32(2));
  assert.equal(underCount, 1000); // 所有点都在曲线上或下方
  assert.ok(Math.abs(estimate - 1) < 0.05);
});

test('∫_0^2 0.5 dx = 1（常数 0.5）', () => {
  const { estimate } = monteCarloIntegrate(() => 0.5, 0, 2, 0, 1, 5000, mulberry32(3));
  assert.ok(Math.abs(estimate - 1) < 0.1, `估计 ${estimate} 偏离 1`);
});

test('同种子可复现', () => {
  const a = monteCarloIntegrate(Math.sin, 0, Math.PI, 0, 1, 1000, mulberry32(99));
  const b = monteCarloIntegrate(Math.sin, 0, Math.PI, 0, 1, 1000, mulberry32(99));
  assert.deepEqual(a, b);
});

test('误差随样本增加而减小（趋势）', () => {
  const errSmall = Math.abs(
    monteCarloIntegrate(Math.sin, 0, Math.PI, 0, 1, 100, mulberry32(5)).estimate - 2,
  );
  const errLarge = Math.abs(
    monteCarloIntegrate(Math.sin, 0, Math.PI, 0, 1, 10000, mulberry32(5)).estimate - 2,
  );
  assert.ok(errLarge <= errSmall + 0.05, `大样本误差 ${errLarge} 应不显著大于小样本 ${errSmall}`);
});

test('采样点记录正确', () => {
  const { points, underCount } = monteCarloIntegrate(
    Math.sin,
    0,
    Math.PI,
    0,
    1,
    500,
    mulberry32(7),
  );
  assert.equal(points.length, 500);
  // underCount 与 points 中 under=true 数量一致
  const actualUnder = points.filter((p) => p.under).length;
  assert.equal(actualUnder, underCount);
  // 所有点在包围盒内
  for (const p of points) {
    assert.ok(p.x >= 0 && p.x <= Math.PI);
    assert.ok(p.y >= 0 && p.y <= 1);
  }
});

test('钩子触发', () => {
  const samples: number[] = [];
  const batches: number[] = [];
  monteCarloIntegrate(Math.sin, 0, Math.PI, 0, 1, 100, mulberry32(1), 20, {
    onSample: (_p, _u, t) => samples.push(t),
    onBatch: (_e, t) => batches.push(t),
  });
  assert.equal(samples.length, 100);
  assert.equal(batches.length, 5); // 100/20
});

test('buildTrace 生成至少 4 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
  for (const f of frames) {
    assert.ok(f.aux === undefined || Array.isArray(f.aux));
    assert.ok(
      f.graph === undefined || (Array.isArray(f.graph.nodes) && Array.isArray(f.graph.edges)),
    );
  }
});

test('DEFAULT_INPUT.truth=2', () => {
  assert.equal(DEFAULT_INPUT.truth, 2);
  assert.equal(DEFAULT_INPUT.n, 500);
});
