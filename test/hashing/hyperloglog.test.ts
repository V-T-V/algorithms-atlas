import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  HyperLogLog,
  estimateCardinality,
  hash32,
  clz32,
} from '../../src/algorithms/hashing/hyperloglog/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hyperloglog/trace.ts';

test('hyperloglog hash32 确定性', () => {
  assert.equal(hash32('abc'), hash32('abc'));
  assert.notEqual(hash32('abc'), hash32('abd'));
});

test('hyperloglog hash32 输出无符号 32 位', () => {
  for (const s of ['', 'a', 'hello', '测试']) {
    const h = hash32(s);
    assert.ok(h >= 0 && h < 0x100000000);
    assert.equal(Number.isInteger(h), true);
  }
});

test('hyperloglog clz32 正确性', () => {
  assert.equal(clz32(0), 32);
  assert.equal(clz32(1), 31);
  assert.equal(clz32(0x80000000), 0);
  assert.equal(clz32(0x40000000), 1);
  assert.equal(clz32(0xffffffff), 0);
  assert.equal(clz32(0x00010000), 15);
});

test('hyperloglog 估计接近真实基数', () => {
  const n = 10000;
  const items: string[] = [];
  for (let i = 0; i < n; i++) items.push(`item-${i}`);
  const est = estimateCardinality(items, 12);
  // 误差应在 20% 内（精度 12 较高）
  const err = Math.abs(est - n) / n;
  assert.ok(err < 0.2, `估计 ${est} 偏离 ${n} 过多，误差 ${err}`);
});

test('hyperloglog 重复元素不增加估计', () => {
  const n = 5000;
  const items: string[] = [];
  for (let i = 0; i < n; i++) items.push(`x-${i}`);
  const est1 = estimateCardinality(items, 12);
  // 加入同样元素两遍
  const items2 = [...items, ...items];
  const est2 = estimateCardinality(items2, 12);
  // 两次应接近（去重后基数相同）
  const diff = Math.abs(est1 - est2) / est1;
  assert.ok(diff < 0.2, `重复应不显著增加估计：est1=${est1} est2=${est2}`);
});

test('hyperloglog 小基数精确性较好', () => {
  const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  const est = estimateCardinality(items, 10);
  // 小基数（≤ 2.5m）走 LinearCounting，应相当精确
  assert.ok(est >= 5 && est <= 15, `小基数估计 ${est} 偏离 10 过多`);
});

test('hyperloglog observed 统计含重复', () => {
  const hll = new HyperLogLog(10);
  hll.add('x');
  hll.add('x');
  hll.add('y');
  assert.equal(hll.observed, 3);
});

test('hyperloglog merge 合并两流', () => {
  const a = new HyperLogLog(14);
  const b = new HyperLogLog(14);
  for (let i = 0; i < 5000; i++) a.add(`k-${i}`);
  for (let i = 5000; i < 10000; i++) b.add(`k-${i}`);
  a.merge(b);
  const est = a.estimate();
  const err = Math.abs(est - 10000) / 10000;
  assert.ok(err < 0.3, `合并后估计 ${est} 偏离 10000`);
});

test('hyperloglog precision 越界抛错', () => {
  assert.throws(() => new HyperLogLog(2));
  assert.throws(() => new HyperLogLog(20));
});

test('hyperloglog 不同精度寄存器数正确', () => {
  assert.equal(new HyperLogLog(6).m, 64);
  assert.equal(new HyperLogLog(10).m, 1024);
});

test('hyperloglog 钩子被调用', () => {
  const hll = new HyperLogLog(6);
  let calls = 0;
  hll.add('test', { onObserve: () => calls++ });
  assert.equal(calls, 1);
});

test('buildTrace 含 array2d（grid），末帧含最终估计', () => {
  const frames = buildTrace({ distinct: 100, repeats: 2, precision: 6 });
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array2d, '首帧含 array2d');
  const last = frames[frames.length - 1]!;
  const est = last.aux!.find((e) => e.label === '最终估计');
  assert.ok(est, '末帧应含最终估计');
  assert.ok(Number(est!.value) > 0);
});
