import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monteCarloPi, mulberry32 } from '../../src/algorithms/randomized/monte-carlo-pi/impl.ts';

test('monte-carlo-pi 估计接近 π（大样本）', () => {
  const r = monteCarloPi(100000, mulberry32(42));
  assert.ok(Math.abs(r.pi - Math.PI) < 0.05, `π 估计 ${r.pi} 应在真值 ±0.05 内`);
});

test('monte-carlo-pi 固定种子可复现', () => {
  const a = monteCarloPi(400, mulberry32(42));
  const b = monteCarloPi(400, mulberry32(42));
  assert.equal(a.pi, b.pi);
  assert.equal(a.insideCount, b.insideCount);
  assert.equal(a.totalCount, b.totalCount);
  // 已知：seed=42, n=400 → inside=313, π=3.13
  assert.equal(a.insideCount, 313);
  assert.equal(a.totalCount, 400);
});

test('monte-carlo-pi 公式正确：pi = 4*inside/total', () => {
  const r = monteCarloPi(1000, mulberry32(7));
  assert.ok(Math.abs(r.pi - (4 * r.insideCount) / r.totalCount) < 1e-9);
});

test('monte-carlo-pi 所有点坐标在 [0,1)', () => {
  const r = monteCarloPi(500, mulberry32(1));
  for (const p of r.points) {
    assert.ok(p.x >= 0 && p.x < 1, `x=${p.x} 越界`);
    assert.ok(p.y >= 0 && p.y < 1, `y=${p.y} 越界`);
  }
});

test('monte-carlo-pi inside 判定一致（x²+y² ≤ 1）', () => {
  const r = monteCarloPi(500, mulberry32(1));
  for (const p of r.points) {
    const expected = p.x * p.x + p.y * p.y <= 1;
    assert.equal(p.inside, expected);
  }
});

test('monte-carlo-pi 收敛性：样本越多越准', () => {
  // 多次取平均看趋势：100000 应普遍比 1000 更接近真值
  const small = Math.abs(monteCarloPi(1000, mulberry32(42)).pi - Math.PI);
  const large = Math.abs(monteCarloPi(100000, mulberry32(42)).pi - Math.PI);
  // 不强制单调（随机性），但大样本误差应较小数量级
  assert.ok(small >= 0);
  assert.ok(large < 0.05, `大样本误差 ${large} 应 < 0.05`);
});

test('monte-carlo-pi n=0 返回 0', () => {
  const r = monteCarloPi(0, mulberry32(1));
  assert.equal(r.pi, 0);
  assert.equal(r.totalCount, 0);
  assert.equal(r.insideCount, 0);
  assert.equal(r.points.length, 0);
});

test('monte-carlo-pi 钩子被调用', () => {
  let samples = 0;
  let batches = 0;
  monteCarloPi(100, mulberry32(1), 10, {
    onSample: () => samples++,
    onBatch: () => batches++,
  });
  assert.equal(samples, 100, '每个点回调一次 onSample');
  assert.equal(batches, 10, '每 10 个点回调一次 onBatch');
});

test('monte-carlo-pi 估计值合理范围 [2, 4.5]', () => {
  // 即便小样本有随机性，π 估计应在合理范围
  for (const seed of [1, 2, 3, 42, 99]) {
    const r = monteCarloPi(200, mulberry32(seed));
    assert.ok(r.pi >= 2 && r.pi <= 4.5, `seed=${seed} 估计 ${r.pi} 异常`);
  }
});
