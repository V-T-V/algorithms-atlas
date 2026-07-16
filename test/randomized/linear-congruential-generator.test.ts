import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LCG,
  generateLcgSequence,
  GLIBC_M,
} from '../../src/algorithms/randomized/linear-congruential-generator/impl.ts';

test('lcg 固定种子确定性输出', () => {
  const a = generateLcgSequence(42, 5);
  const b = generateLcgSequence(42, 5);
  assert.deepEqual(a, b);
});

test('lcg seed=42 前 5 个值（glibc 参数）', () => {
  const seq = generateLcgSequence(42, 5);
  assert.deepEqual(seq, [1250496027, 1116302264, 1000676753, 1668674806, 908095735]);
});

test('lcg seed=1 前 3 个值', () => {
  const seq = generateLcgSequence(1, 3);
  assert.deepEqual(seq, [1103527590, 377401575, 662824084]);
});

test('lcg 输出落在 [0, m) 范围内', () => {
  const gen = new LCG(12345);
  for (let i = 0; i < 1000; i++) {
    const v = gen.next();
    assert.ok(v >= 0 && v < GLIBC_M, `v=${v} 越界`);
  }
});

test('lcg nextInt 落在 [0, max)', () => {
  const gen = new LCG(999);
  const max = 100;
  for (let i = 0; i < 1000; i++) {
    const v = gen.nextInt(max);
    assert.ok(v >= 0 && v < max, `v=${v} 越界`);
  }
});

test('lcg nextFloat 落在 [0, 1)', () => {
  const gen = new LCG(7);
  for (let i = 0; i < 1000; i++) {
    const v = gen.nextFloat();
    assert.ok(v >= 0 && v < 1, `v=${v} 越界`);
  }
});

test('lcg 不同种子产生不同序列', () => {
  const a = generateLcgSequence(1, 5);
  const b = generateLcgSequence(2, 5);
  assert.notDeepEqual(a, b);
});

test('lcg 满周期：序列在 m 步内不重复（抽样验证小段无重复）', () => {
  // m=2^31 太大，此处仅验证前若干值互不相同
  const gen = new LCG(12345);
  const seen = new Set<number>();
  for (let i = 0; i < 10000; i++) {
    const v = gen.next();
    assert.equal(seen.has(v), false, `第 ${i} 个值重复`);
    seen.add(v);
  }
});

test('lcg 钩子被调用', () => {
  const values: number[] = [];
  generateLcgSequence(42, 3, {
    onNext: (v) => values.push(v),
  });
  assert.equal(values.length, 3);
  assert.deepEqual(values, [1250496027, 1116302264, 1000676753]);
});

test('lcg 自定义参数（Numerical Recipes）', () => {
  // Numerical Recipes: a=1664525, c=1013904223, m=2^32
  const gen = new LCG(1, 1664525, 1013904223, 2 ** 32);
  const v1 = gen.next();
  const v2 = gen.next();
  assert.ok(v1 >= 0 && v1 < 2 ** 32);
  assert.ok(v2 >= 0 && v2 < 2 ** 32);
});
