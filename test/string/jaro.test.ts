import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jaro } from '../../src/algorithms/string/jaro/impl.ts';

const approx = (x: number, y: number, eps = 1e-6): boolean => Math.abs(x - y) < eps;

test('jaro 基本相似度', () => {
  assert.ok(approx(jaro('', ''), 1));
  assert.ok(approx(jaro('A', 'A'), 1));
  assert.ok(approx(jaro('A', 'B'), 0));
  assert.ok(approx(jaro('MARTHA', 'MARHTA'), 0.9444444));
  assert.ok(approx(jaro('DIXON', 'DICKSONX'), 0.7666667));
  assert.ok(approx(jaro('JELLYFISH', 'SMELLYFISH'), 0.8962963));
});

test('jaro 完全相同与完全不同', () => {
  assert.ok(approx(jaro('ABCD', 'ABCD'), 1));
  assert.ok(approx(jaro('AB', 'CD'), 0));
});

test('jaro 钩子被调用', () => {
  let matches = 0;
  let done = -1;
  jaro('MARTHA', 'MARHTA', {
    onMatch: () => matches++,
    onDone: (s) => (done = s),
  });
  assert.equal(matches, 6, '应匹配 6 个字符');
  assert.ok(done > 0.9, '相似度应较高');
});
