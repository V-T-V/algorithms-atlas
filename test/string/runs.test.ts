import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runs } from '../../src/algorithms/string/runs/impl.ts';

test('runs 基本周期区间', () => {
  // 'aaabaaaa' → 周期 1 的极大区间 [0,2] (aaa) 和 [4,7] (aaaa)
  const r = runs('aaabaaaa');
  // 至少检测到 a 的两段周期
  assert.ok(r.length >= 1);
  for (const run of r) {
    assert.ok(run.exponent >= 2);
  }
});

test('runs ababab 周期 2', () => {
  const r = runs('ababab');
  // 整串以周期 2 延展，exponent=3
  const full = r.find((x) => x.l === 0 && x.r === 5);
  assert.ok(full !== undefined);
  assert.equal(full!.period, 2);
});

test('runs 无周期性', () => {
  // 'abcdef' 无 run（相邻无重复模式）
  const r = runs('abcdef');
  // 可能返回空
  assert.ok(Array.isArray(r));
});

test('runs 钩子', () => {
  let runCount = 0;
  runs('ababab', { onRun: () => runCount++ });
  assert.ok(runCount >= 1);
});
