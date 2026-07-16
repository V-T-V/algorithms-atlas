import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  moebiusInvert,
  moebiusSieve,
  divisorSum,
} from '../../src/algorithms/math/moebius-inversion/impl.ts';

test('moebiusSieve 基本值', () => {
  const mu = moebiusSieve(12);
  // μ: 1:1,2:-1,3:-1,4:0,5:-1,6:1,7:-1,8:0,9:0,10:1,11:-1,12:0
  assert.deepEqual(mu.slice(0, 13), [0, 1, -1, -1, 0, -1, 1, -1, 0, 0, 1, -1, 0]);
});

test('反演 σ 恢复恒等函数', () => {
  const N = 30;
  const sigma = divisorSum(N);
  const f = moebiusInvert(sigma, N);
  for (let n = 1; n <= N; n++) assert.equal(f[n], n, `f(${n})`);
});

test('反演 σ 正确性（大 N）', () => {
  const N = 100;
  const sigma = divisorSum(N);
  const f = moebiusInvert(sigma, N);
  for (let n = 1; n <= N; n++) assert.equal(f[n], n, `f(${n})`);
});

test('反演可逆性：f → g → f', () => {
  // 取 f(n)=n²，构造 g(n)=Σ_{d|n} d²，再反演应恢复 f
  const N = 30;
  const f0 = new Array<number>(N + 1).fill(0);
  for (let n = 1; n <= N; n++) f0[n] = n * n;
  const g = new Array<number>(N + 1).fill(0);
  for (let d = 1; d <= N; d++) {
    for (let k = d; k <= N; k += d) g[k]! += f0[d]!;
  }
  const f = moebiusInvert(g, N);
  for (let n = 1; n <= N; n++) assert.equal(f[n], n * n, `f(${n})`);
});
