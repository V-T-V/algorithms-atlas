import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  pearson8,
  pearsonMulti,
  canonicalizeTable,
  getTable,
} from '../../src/algorithms/hashing/pearson-hash-impl/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/pearson-hash-impl/trace.ts';

test('pearson8 输出 0..255', () => {
  for (const s of ['', 'a', 'abc', 'hello world', '测试文本']) {
    const h = pearson8(s);
    assert.ok(h >= 0 && h < 256, `h=${h} 越界`);
    assert.equal(Number.isInteger(h), true);
  }
});

test('pearson8 确定性（同输入同输出）', () => {
  assert.equal(pearson8('hello'), pearson8('hello'));
});

test('pearson8 不同输入大概率不同', () => {
  const a = pearson8('hello');
  const b = pearson8('world');
  assert.notEqual(a, b);
});

test('pearson8 种子影响输出', () => {
  const a = pearson8('hello', 0);
  const b = pearson8('hello', 1);
  assert.notEqual(a, b);
});

test('pearson8 空输入返回 T[seed]（或经表查询的结果）', () => {
  const seed = 5;
  // 空输入：循环不执行，h = seed & 0xff
  assert.equal(pearson8('', seed), seed & 0xff);
});

test('canonicalizeTable 生成合法 0..255 置换', () => {
  const t = canonicalizeTable([5, 5, 5, 1, 2, 3, 4]);
  assert.equal(t.length, 256);
  const set = new Set(t);
  assert.equal(set.size, 256, '应有 256 个不同值');
  for (let i = 0; i < 256; i++) assert.ok(set.has(i));
});

test('getTable 是合法置换', () => {
  const t = getTable();
  assert.equal(t.length, 256);
  assert.equal(new Set(t).size, 256);
});

test('pearsonMulti 输出指定宽度', () => {
  const out = pearsonMulti('hello', 4);
  assert.equal(out.length, 4);
  for (const v of out) assert.ok(v >= 0 && v < 256);
});

test('pearson8 字节数组输入与字符串一致', () => {
  const h1 = pearson8([0x68, 0x65, 0x6c, 0x6c, 0x6f]); // 'hello'
  const h2 = pearson8('hello');
  assert.equal(h1, h2);
});

test('pearson8 钩子：每个字节触发 onByte', () => {
  let bytes = 0;
  let result = 0;
  pearson8('abc', 0, {
    onByte: () => bytes++,
    onResult: (h) => (result = h),
  });
  assert.equal(bytes, 3);
  assert.ok(result >= 0);
});

test('buildTrace 含 aux 与 array，末帧含最终 hash', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const h = last.aux!.find((e) => e.label === '最终 hash');
  assert.ok(h, '末帧应含最终 hash');
});
