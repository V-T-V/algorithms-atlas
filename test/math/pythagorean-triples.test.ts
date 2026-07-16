import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  primitivePythagoreanTriples,
  allPythagoreanTriples,
} from '../../src/algorithms/math/pythagorean-triples/impl.ts';

const gcd3 = (a: number, b: number, c: number): number => {
  const g = (x: number, y: number): number => (y === 0 ? x : g(y, x % y));
  return g(g(a, b), c);
};

test('pythagorean 本原三元组满足 a²+b²=c² 且 gcd=1', () => {
  const triples = primitivePythagoreanTriples(200);
  assert.ok(triples.length > 0);
  for (const [a, b, c] of triples) {
    assert.equal(a! * a! + b! * b!, c! * c!);
    assert.equal(gcd3(a!, b!, c!), 1);
  }
});

test('pythagorean 含经典 (3,4,5)', () => {
  const triples = primitivePythagoreanTriples(50);
  const has345 = triples.some(([a, b, c]) => {
    const s = [a, b].sort((x, y) => x - y);
    return s[0] === 3 && s[1] === 4 && c === 5;
  });
  assert.ok(has345);
});

test('pythagorean (5,12,13)', () => {
  const triples = primitivePythagoreanTriples(50);
  const has = triples.some(([a, b, c]) => {
    const s = [a, b].sort((x, y) => x - y);
    return s[0] === 5 && s[1] === 12 && c === 13;
  });
  assert.ok(has);
});

test('pythagorean 全体包含非本原 (6,8,10)', () => {
  const all = allPythagoreanTriples(50);
  const has = all.some(([a, b, c]) => {
    const s = [a, b].sort((x, y) => x - y);
    return s[0] === 6 && s[1] === 8 && c === 10;
  });
  assert.ok(has);
});

test('pythagorean 空范围', () => {
  // c ≤ 4 没有（最小 5）
  assert.equal(primitivePythagoreanTriples(4).length, 0);
});

test('pythagorean 钩子', () => {
  let gens = 0;
  primitivePythagoreanTriples(50, { onGenerate: () => gens++ });
  assert.ok(gens > 0);
});
