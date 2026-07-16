import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lucasSequence } from '../../src/algorithms/math/lucas-sequence/impl.ts';

test('lucasSequence U(1,-1)=Fibonacci', () => {
  const fib = [0n, 1n, 1n, 2n, 3n, 5n, 8n, 13n, 21n, 34n, 55n];
  for (let n = 0; n <= 10; n++) assert.equal(lucasSequence(1, -1, n).U, fib[n], `U(${n})`);
});

test('lucasSequence V(1,-1)=Lucas 数', () => {
  // Lucas: 2,1,3,4,7,11,18,29,47,76,123
  const lucas = [2n, 1n, 3n, 4n, 7n, 11n, 18n, 29n, 47n, 76n, 123n];
  for (let n = 0; n <= 10; n++) assert.equal(lucasSequence(1, -1, n).V, lucas[n], `V(${n})`);
});

test('lucasSequence U(2,-1)=Pell 数', () => {
  // Pell: 0,1,2,5,12,29,70,169
  const pell = [0n, 1n, 2n, 5n, 12n, 29n, 70n, 169n];
  for (let n = 0; n <= 7; n++) assert.equal(lucasSequence(2, -1, n).U, pell[n], `Pell(${n})`);
});

test('lucasSequence 与朴素递推一致', () => {
  const P = 3n;
  const Q = 2n;
  const U: bigint[] = [0n, 1n];
  const V: bigint[] = [2n, P];
  for (let n = 2; n <= 50; n++) {
    U.push(P * U[n - 1]! - Q * U[n - 2]!);
    V.push(P * V[n - 1]! - Q * V[n - 2]!);
  }
  for (let n = 0; n <= 50; n++) {
    assert.equal(lucasSequence(P, Q, n).U, U[n]!, `U(${n})`);
    assert.equal(lucasSequence(P, Q, n).V, V[n]!, `V(${n})`);
  }
});

test('lucasSequence 边界', () => {
  assert.deepEqual(lucasSequence(1, -1, 0), { U: 0n, V: 2n });
  assert.deepEqual(lucasSequence(5, 3, 1), { U: 1n, V: 5n });
  assert.throws(() => lucasSequence(1, -1, -1), RangeError);
});
