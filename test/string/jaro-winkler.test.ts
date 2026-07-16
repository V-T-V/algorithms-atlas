import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jaroWinkler } from '../../src/algorithms/string/jaro-winkler/impl.ts';

const approx = (x: number, y: number, eps = 1e-6): boolean => Math.abs(x - y) < eps;

test('jaroWinkler 基本相似度', () => {
  assert.ok(approx(jaroWinkler('', ''), 1));
  assert.ok(approx(jaroWinkler('A', 'A'), 1));
  assert.ok(approx(jaroWinkler('MARTHA', 'MARHTA'), 0.9611111));
  assert.ok(approx(jaroWinkler('DIXON', 'DICKSONX'), 0.8133333));
});

test('jaroWinkler 不小于 Jaro', () => {
  // JW = J + l*p*(1-J) >= J 总成立
  assert.ok(jaroWinkler('MARTHA', 'MARHTA') >= 0.9444444 - 1e-9);
});

test('jaroWinkler 钩子被调用', () => {
  let prefix = -1;
  let done = -1;
  jaroWinkler('MARTHA', 'MARHTA', {
    onPrefix: (l) => (prefix = l),
    onDone: (s) => (done = s),
  });
  assert.equal(prefix, 3, '公共前缀 MAR 长度 3');
  assert.ok(done > 0.96);
});
