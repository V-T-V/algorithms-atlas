import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lzw, lzwDecode, ALPHA_START } from '../../src/algorithms/compression/lzw/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/compression/lzw/trace.ts';

test('lzw 编解码往返一致', () => {
  for (const s of ['ABABABA', 'TOBEORNOTTOBEORTOBEORNOT', 'banana', 'AAAAAAA', 'abcdefg']) {
    const { codes } = lzw(s);
    assert.equal(lzwDecode(codes), s, `往返不一致: ${s}`);
  }
});

test('lzw 经典示例 ABABABA', () => {
  // A B A B A B A
  // 逐步：p=A -> emit 65(A), add 256(AB); p=B -> emit 66(B), add 257(BA);
  //      p=A, AB in dict -> p=AB; ABA not in dict -> emit 256(AB), add 258(ABA);
  //      p=A, AB in dict -> p=AB; ABA in dict -> p=ABA; end -> emit 258(ABA)
  // 输出: 65 66 256 258
  const { codes } = lzw('ABABABA');
  assert.deepEqual(codes, [65, 66, 256, 258]);
});

test('lzw 单字符输入', () => {
  const { codes } = lzw('A');
  assert.deepEqual(codes, [65]);
  assert.equal(lzwDecode(codes), 'A');
});

test('lzw 空输入', () => {
  const { codes, dict } = lzw('');
  assert.deepEqual(codes, []);
  // 字典仍含 256 个初始条目
  assert.equal(dict.size, ALPHA_START);
});

test('lzw 全相同字符产生递增字典', () => {
  // AAAAA: p=A -> emit 65, add 256(AA); p=A, AA in dict -> p=AA;
  //        AAA not in dict -> emit 256(AA), add 257(AAA); p=A, AA in dict -> p=AA; end -> emit 256(AA)
  // 输出: 65 256 256
  const { codes } = lzw('AAAAA');
  assert.deepEqual(codes, [65, 256, 256]);
  assert.equal(lzwDecode(codes), 'AAAAA');
  assert.equal(codes[0], 65);
  assert.equal(codes[1], ALPHA_START); // AA
});

test('lzw 不修改原串（纯函数）', () => {
  const s = 'TOBEORNOTTOBE';
  const { codes: a } = lzw(s);
  const { codes: b } = lzw(s);
  assert.deepEqual(a, b, '两次编码应一致');
});

test('lzw 钩子：每输出一个码字即向字典加入一项', () => {
  const emitted: number[] = [];
  const added: number[] = [];
  lzw('ABABABA', {
    onEmit: (code) => emitted.push(code),
    onDictAdd: (code) => added.push(code),
  });
  // 输出 4 个码字（末尾输出不加字典） → 加入 3 个新条目
  assert.deepEqual(emitted, [65, 66, 256, 258]);
  assert.equal(added.length, 3);
  assert.deepEqual(added, [256, 257, 258]);
});

test('lzwDecode 处理「刚加入即被自身引用」的特殊情形', () => {
  // 构造 ABABABABA：编码会产生 code === nextCode 的自引用情形
  const s = 'ABABABABA';
  const { codes } = lzw(s);
  assert.equal(lzwDecode(codes), s);
});

test('buildTrace 生成有序帧且末帧含码字流', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3, '至少初始帧 + 若干步骤帧 + 终态帧');
  const first = frames[0]!;
  assert.ok(first.array, '首帧含 array');
  assert.ok(first.aux, '首帧含 aux（字典/前缀）');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
  const codesEntry = last.map!.find((e) => e.key.includes('codes') || e.key.includes('码字'));
  assert.ok(codesEntry, '末帧应含码字流');
  assert.ok(codesEntry!.value.length > 0);
});
