import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generatePowerSet } from '../../src/algorithms/recursion/recursive-power-set/impl.ts';

test('generatePowerSet n=2', () => {
  const res = generatePowerSet(2);
  assert.equal(res.length, 4);
  assert.deepEqual(res, [[], [1], [0], [0, 1]]);
});

test('generatePowerSet n=3 数量=8', () => {
  const res = generatePowerSet(3);
  assert.equal(res.length, 8);
  // 无重复
  const seen = new Set(res.map((s) => s.join(',')));
  assert.equal(seen.size, 8);
  // 每个子集元素唯一递增
  for (const s of res) {
    for (let i = 1; i < s.length; i++) {
      assert.ok(s[i - 1]! < s[i]!);
    }
  }
});

test('generatePowerSet 含空集和全集', () => {
  const res = generatePowerSet(4);
  assert.ok(res.some((s) => s.length === 0));
  assert.ok(res.some((s) => s.length === 4));
});

test('generatePowerSet 边界', () => {
  assert.deepEqual(generatePowerSet(0), [[]]);
});

test('generatePowerSet 数量 = 2^n', () => {
  for (let n = 0; n <= 10; n++) {
    assert.equal(generatePowerSet(n).length, 2 ** n, `n=${n}`);
  }
});

test('generatePowerSet 非法输入抛错', () => {
  assert.throws(() => generatePowerSet(-1));
  assert.throws(() => generatePowerSet(1.5));
});
