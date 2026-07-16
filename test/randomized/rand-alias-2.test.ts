import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAlias, aliasSample } from '../../src/algorithms/randomized/rand-alias-2/impl.ts';

test('buildAlias 基本构建', () => {
  const t = buildAlias([1, 1, 1, 1]);
  assert.equal(t.n, 4);
  // 等权 → 每列 prob=1，无别名
  for (let i = 0; i < 4; i++) assert.equal(t.prob[i], 1);
});

test('aliasSample 长度正确', () => {
  const t = buildAlias([1, 2, 3]);
  const s = aliasSample(t, 100);
  assert.equal(s.length, 100);
  for (const v of s) assert.ok(v >= 0 && v < 3);
});

test('aliasSample 频次近似权重比', () => {
  const weights = [1, 3];
  const t = buildAlias(weights);
  const counts = [0, 0];
  let seed = 7;
  const rng = () => {
    seed = (seed * 1103515245 + 12345) >>> 0;
    return seed / 0x100000000;
  };
  const samples = aliasSample(t, 10000, rng);
  for (const v of samples) counts[v]!++;
  // 期望比例 1:3 → 约 2500:7500
  assert.ok(counts[1]! > counts[0]! * 2, `1(${counts[1]}) 应明显多于 0(${counts[0]})`);
  const ratio = counts[1]! / counts[0]!;
  assert.ok(ratio > 2.5 && ratio < 3.5, `比例 ${ratio.toFixed(2)} 偏离 3`);
});

test('aliasSample 确定性', () => {
  const t = buildAlias([5, 2, 1]);
  const a = aliasSample(t, 20);
  const b = aliasSample(t, 20);
  assert.deepEqual(a, b);
});

test('buildAlias 空数组', () => {
  const t = buildAlias([]);
  assert.equal(t.n, 0);
});

test('buildAlias 单元素', () => {
  const t = buildAlias([42]);
  const s = aliasSample(t, 5);
  assert.deepEqual(s, [0, 0, 0, 0, 0]);
});
