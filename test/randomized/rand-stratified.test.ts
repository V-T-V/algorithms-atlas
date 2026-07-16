import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  stratifiedSample1D,
  stratifiedIntegrate,
  stratifiedSample2D,
} from '../../src/algorithms/randomized/rand-stratified/impl.ts';

test('stratifiedSample1D 每层一个点', () => {
  const n = 8;
  const s = stratifiedSample1D(n);
  assert.equal(s.length, n);
  // 每个点应落在对应层 [i/n, (i+1)/n)
  for (let i = 0; i < n; i++) {
    assert.ok(s[i]! >= i / n && s[i]! < (i + 1) / n, `点 ${s[i]} 不在层 ${i}`);
  }
});

test('stratifiedIntegrate 比 crude MC 方差小', () => {
  // ∫₀¹ x² dx = 1/3
  const est = stratifiedIntegrate((x) => x * x, 100);
  assert.ok(Math.abs(est - 1 / 3) < 0.02, `估计 ${est} 偏离 1/3`);
});

test('stratifiedSample2D 数量正确', () => {
  const pts = stratifiedSample2D(4);
  assert.equal(pts.length, 16);
  for (const [x, y] of pts) {
    assert.ok(x >= 0 && x < 1);
    assert.ok(y >= 0 && y < 1);
  }
});

test('stratifiedSample1D 确定性', () => {
  const a = stratifiedSample1D(10);
  const b = stratifiedSample1D(10);
  assert.deepEqual(a, b);
});
