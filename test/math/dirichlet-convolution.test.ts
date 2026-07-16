import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  dirichletConvolution,
  ones,
  identityFn,
  epsilon,
} from '../../src/algorithms/math/dirichlet-convolution/impl.ts';
import { mobiusSieve } from '../../src/algorithms/math/mertens-function/impl.ts';

test('μ * 1 = ε', () => {
  const N = 30;
  const mu = mobiusSieve(N);
  const one = ones(N);
  const h = dirichletConvolution(mu, one, N);
  assert.deepEqual(h, epsilon(N));
});

test('φ * 1 = id（恒等）', () => {
  const N = 30;
  // 先求 φ
  const phi = new Array<number>(N + 1).fill(0);
  phi[1] = 1;
  const isComp = new Array<boolean>(N + 1).fill(false);
  const primes: number[] = [];
  for (let i = 2; i <= N; i++) {
    if (!isComp[i]) {
      primes.push(i);
      phi[i] = i - 1;
    }
    for (const p of primes) {
      const c = i * p;
      if (c > N) break;
      isComp[c] = true;
      if (i % p === 0) {
        phi[c] = phi[i]! * p;
        break;
      } else {
        phi[c] = phi[i]! * (p - 1);
      }
    }
  }
  const h = dirichletConvolution(phi, ones(N), N);
  assert.deepEqual(h, identityFn(N));
});

test('1 * 1 = 约数个数 d(n)', () => {
  const N = 20;
  const one = ones(N);
  const h = dirichletConvolution(one, one, N);
  // d(n): 1:1, 2:2, 3:2, 4:3, 5:2, 6:4, ...
  const expected = [0, 1, 2, 2, 3, 2, 4, 2, 4, 3, 4, 2, 6, 2, 4, 4, 5, 2, 6, 2, 6];
  assert.deepEqual(h, expected);
});

test('dirichletConvolution 钩子', () => {
  let count = 0;
  dirichletConvolution(ones(5), ones(5), 5, { onAccumulate: () => count++ });
  // 累加次数 = Σ floor(N/d) for d=1..5 = 5+2+1+1+1 = 10
  assert.equal(count, 10);
});
