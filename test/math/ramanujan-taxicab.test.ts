import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ramanujanTaxicab,
  findAllTaxicab,
} from '../../src/algorithms/math/ramanujan-taxicab/impl.ts';

test('taxicab Ta(2) = 1729', () => {
  const { taxicab, representations } = ramanujanTaxicab(20);
  assert.equal(taxicab, 1729);
  assert.equal(representations.length, 2);
  // 1^3+12^3 与 9^3+10^3
  const reprs = representations.map(([a, b]) => `${a},${b}`).sort();
  assert.ok(reprs.includes('1,12'));
  assert.ok(reprs.includes('9,10'));
});

test('taxicab 上限不足未找到', () => {
  // a,b 上限 11：12^3 无法达到
  const { taxicab } = ramanujanTaxicab(11);
  assert.equal(taxicab, 0);
});

test('taxicab findAll 含 1729 与 4104', () => {
  // 4104 = 2^3+16^3 = 9^3+15^3
  const all = findAllTaxicab(20, 5000);
  const sums = all.map((x) => x.sum);
  assert.ok(sums.includes(1729));
  assert.ok(sums.includes(4104));
});

test('taxicab 1729 表示唯一两种', () => {
  const all = findAllTaxicab(20, 2000);
  const t = all.find((x) => x.sum === 1729);
  assert.ok(t);
  assert.equal(t!.reprs.length, 2);
});

test('taxicab 钩子被调用', () => {
  let pairs = 0;
  let foundCount = 0;
  ramanujanTaxicab(20, {
    onPair: () => pairs++,
    onFound: () => foundCount++,
  });
  assert.ok(pairs > 0);
  assert.equal(foundCount, 1);
});

test('taxicab 立方和验证', () => {
  const { representations } = ramanujanTaxicab(20);
  for (const [a, b] of representations) {
    assert.equal(a * a * a + b * b * b, 1729);
  }
});
