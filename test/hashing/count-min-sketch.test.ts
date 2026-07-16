import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CountMinSketch,
  estimateFrequencies,
  hashWithSeed,
} from '../../src/algorithms/hashing/count-min-sketch/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/count-min-sketch/trace.ts';

test('count-min-sketch 估计 ≥ 真实频率（只高估）', () => {
  const cms = new CountMinSketch(5, 100);
  const trueCount: Record<string, number> = {};
  const stream = ['a', 'a', 'b', 'a', 'c', 'b', 'a'];
  for (const it of stream) {
    cms.update(it);
    trueCount[it] = (trueCount[it] ?? 0) + 1;
  }
  for (const [item, real] of Object.entries(trueCount)) {
    const est = cms.estimate(item);
    assert.ok(est >= real, `"${item}" 估计 ${est} < 真实 ${real}`);
  }
});

test('count-min-sketch 单元素重复 N 次估计 = N（无冲突时）', () => {
  const cms = new CountMinSketch(5, 1000);
  cms.update('x', 50);
  assert.equal(cms.estimate('x'), 50);
});

test('count-min-sketch 未出现元素估计可为 0 或正（只高估）', () => {
  const cms = new CountMinSketch(3, 8);
  cms.update('a', 10);
  const est = cms.estimate('zzz');
  assert.ok(est >= 0);
});

test('count-min-sketch totalCount 累计', () => {
  const cms = new CountMinSketch(4, 16);
  cms.update('a', 3);
  cms.update('b', 5);
  assert.equal(cms.totalCount, 8);
});

test('count-min-sketch merge 合并两流', () => {
  const a = new CountMinSketch(4, 32);
  const b = new CountMinSketch(4, 32);
  a.update('x', 3);
  b.update('x', 7);
  a.merge(b);
  assert.ok(a.estimate('x') >= 10);
});

test('count-min-sketch innerProduct 估计', () => {
  const a = new CountMinSketch(4, 32);
  const b = new CountMinSketch(4, 32);
  a.update('x', 5);
  b.update('x', 4);
  const ip = a.innerProduct(b, 'x');
  assert.ok(ip >= 20);
});

test('count-min-sketch 维度不同无法合并', () => {
  const a = new CountMinSketch(4, 16);
  const b = new CountMinSketch(5, 16);
  assert.throws(() => a.merge(b));
});

test('count-min-sketch hashWithSeed 确定性且不同种子不同', () => {
  const h1 = hashWithSeed(1, 'abc');
  const h1b = hashWithSeed(1, 'abc');
  const h2 = hashWithSeed(2, 'abc');
  assert.equal(h1, h1b);
  assert.notEqual(h1, h2);
});

test('count-min-sketch 钩子 onUpdate 被调用 d 次', () => {
  const cms = new CountMinSketch(5, 16);
  let calls = 0;
  cms.update('test', 1, { onUpdate: () => calls++ });
  assert.equal(calls, 5);
});

test('count-min-sketch 空流查询为 0', () => {
  const cms = new CountMinSketch(4, 16);
  assert.equal(cms.estimate('x'), 0);
});

test('estimateFrequencies 便捷函数', () => {
  const result = estimateFrequencies(['a', 'a', 'b'], ['a', 'b', 'c'], 5, 64);
  assert.ok(result['a']! >= 2);
  assert.ok(result['b']! >= 1);
  assert.ok(result['c']! >= 0);
});

test('buildTrace 含 array2d，末帧含总流量', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array2d, '首帧含 array2d');
  const last = frames[frames.length - 1]!;
  const tot = last.aux!.find((e) => e.label === '总流量');
  assert.ok(tot, '末帧应含总流量');
  assert.ok(Number(tot!.value) > 0);
});
