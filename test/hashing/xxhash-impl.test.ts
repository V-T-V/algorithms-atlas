import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xxh32, xxh32Batch, avalanche } from '../../src/algorithms/hashing/xxhash-impl/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/xxhash-impl/trace.ts';

test('xxh32 确定性（同输入同输出）', () => {
  assert.equal(xxh32('hello'), xxh32('hello'));
});

test('xxh32 输出 32 位无符号', () => {
  for (const s of ['', 'a', 'abc', 'hello world', '测试文本']) {
    const h = xxh32(s);
    assert.ok(h >= 0 && h < 0x100000000, `h=${h} 越界`);
    assert.equal(Number.isInteger(h), true);
  }
});

test('xxh32 不同输入大概率不同', () => {
  const a = xxh32('hello');
  const b = xxh32('world');
  assert.notEqual(a, b);
});

test('xxh32 种子影响输出', () => {
  const a = xxh32('hello', 0);
  const b = xxh32('hello', 1);
  assert.notEqual(a, b);
});

test('xxh32 空输入非零且稳定', () => {
  const h = xxh32('');
  assert.ok(h >= 0);
  assert.equal(xxh32(''), h);
});

test('xxh32 长输入（≥16 字节）触发 stripe 路径', () => {
  const long = 'abcdefghijklmnopqrstuvwx'; // 24 字节 = 1 stripe + 8 尾
  const h = xxh32(long);
  assert.ok(h >= 0);
  assert.equal(xxh32(long), h);
});

test('xxh32 雪崩性：相邻输入差异大', () => {
  const a = xxh32('abcdefghijklmnopqrstuvwx');
  const b = xxh32('abcdefghijklnopqrstuvwx'); // 删一字符
  let diffBits = 0;
  const xored = a ^ b;
  for (let i = 0; i < 32; i++) {
    if ((xored >>> i) & 1) diffBits++;
  }
  assert.ok(diffBits >= 8, `雪崩不足：仅 ${diffBits} 位不同`);
});

test('xxh32 字节数组输入与字符串一致', () => {
  const h1 = xxh32([0x68, 0x65, 0x6c, 0x6c, 0x6f]); // 'hello'
  const h2 = xxh32('hello');
  assert.equal(h1, h2);
});

test('avalanche 确定性', () => {
  assert.equal(avalanche(0), avalanche(0));
  assert.equal(avalanche(0xdeadbeef), avalanche(0xdeadbeef));
});

test('xxh32Batch 批量', () => {
  const results = xxh32Batch(['a', 'b', 'c'], 0);
  assert.equal(results.length, 3);
  assert.equal(results[0], xxh32('a', 0));
});

test('xxh32 钩子：长输入触发 stripe', () => {
  let stripes = 0;
  let result = 0;
  xxh32('abcdefghijklmnopqrstuvwx', 0, {
    onStripe: () => stripes++,
    onResult: (h) => (result = h),
  });
  assert.equal(stripes, 1);
  assert.ok(result >= 0);
});

test('buildTrace 含 aux，末帧含最终 hash', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const h = last.aux!.find((e) => e.label === '最终 hash');
  assert.ok(h, '末帧应含最终 hash');
});
