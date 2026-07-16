import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  murmurhash3,
  murmurhash3Batch,
  fmix32,
} from '../../src/algorithms/hashing/murmurhash/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/murmurhash/trace.ts';

test('murmurhash3 确定性（同输入同输出）', () => {
  assert.equal(murmurhash3('hello'), murmurhash3('hello'));
});

test('murmurhash3 输出 32 位无符号', () => {
  for (const s of ['', 'a', 'abc', 'hello world', '测试文本']) {
    const h = murmurhash3(s);
    assert.ok(h >= 0 && h < 0x100000000, `h=${h} 越界`);
    assert.equal(Number.isInteger(h), true);
  }
});

test('murmurhash3 不同输入大概率不同', () => {
  const a = murmurhash3('hello');
  const b = murmurhash3('world');
  assert.notEqual(a, b);
});

test('murmurhash3 种子影响输出', () => {
  const a = murmurhash3('hello', 0);
  const b = murmurhash3('hello', 1);
  assert.notEqual(a, b);
});

test('murmurhash3 空输入返回 fmix32(seed^0)', () => {
  const seed = 42;
  const expected = fmix32(seed ^ 0);
  assert.equal(murmurhash3('', seed), expected);
});

test('murmurhash3 4 字节倍数 vs 含尾字节都能算', () => {
  // 8 字节（2 块）
  const h8 = murmurhash3('abcdefgh');
  assert.ok(h8 >= 0);
  // 10 字节（2 块 + 2 尾）
  const h10 = murmurhash3('abcdefghij');
  assert.ok(h10 >= 0);
  assert.notEqual(h8, h10);
});

test('murmurhash3 雪崩性：相邻输入差异大', () => {
  const a = murmurhash3('abcdefghijklmnop');
  const b = murmurhash3('abcdefghijklnop'); // 改一个字符
  // 不同位至少 25%（8/32）
  let diffBits = 0;
  const xored = a ^ b;
  for (let i = 0; i < 32; i++) {
    if ((xored >>> i) & 1) diffBits++;
  }
  assert.ok(diffBits >= 8, `雪崩不足：仅 ${diffBits} 位不同`);
});

test('murmurhash3 字节数组输入', () => {
  const h1 = murmurhash3([0x68, 0x65, 0x6c, 0x6c, 0x6f]); // 'hello'
  const h2 = murmurhash3('hello');
  assert.equal(h1, h2);
});

test('murmurhash3 fmix32 确定性', () => {
  assert.equal(fmix32(0), fmix32(0));
  assert.equal(fmix32(0xdeadbeef), fmix32(0xdeadbeef));
});

test('murmurhash3Batch 批量', () => {
  const results = murmurhash3Batch(['a', 'b', 'c'], 0);
  assert.equal(results.length, 3);
  assert.equal(results[0], murmurhash3('a', 0));
});

test('murmurhash3 钩子：处理块时触发 onBlock', () => {
  let blocks = 0;
  let result = 0;
  murmurhash3('abcdefgh', 0, {
    onBlock: () => blocks++,
    onResult: (h) => (result = h),
  });
  assert.equal(blocks, 2);
  assert.ok(result >= 0);
});

test('buildTrace 含 aux，末帧含最终 hash', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const h = last.aux!.find((e) => e.label === '最终 hash');
  assert.ok(h, '末帧应含最终 hash');
});
