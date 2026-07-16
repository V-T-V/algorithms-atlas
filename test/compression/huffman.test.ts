import { test } from 'node:test';
import assert from 'node:assert/strict';
import { huffman, huffmanDecode } from '../../src/algorithms/compression/huffman/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/compression/huffman/trace.ts';

test('huffman 单字符退化为 "0"', () => {
  const r = huffman('AAAA');
  assert.equal(r.codes.get('A'), '0');
  assert.equal(r.encoded, '0000');
});

test('huffman 编解码往返一致', () => {
  for (const s of ['ABRACADABRA', 'mississippi', 'hello world', 'abcdef']) {
    const r = huffman(s);
    assert.equal(huffmanDecode(r.encoded, r.codes), s);
  }
});

test('huffman 高频字符码长更短', () => {
  // 'A' 出现 5 次，'B' 1 次 → A 的码长 <= B 的码长
  const r = huffman('AAAAAB');
  assert.ok(r.codes.get('A')!.length <= r.codes.get('B')!.length);
});

test('huffman 是前缀码（无码是另一码前缀）', () => {
  const r = huffman('ABRACADABRA');
  const codes = [...r.codes.values()];
  for (let i = 0; i < codes.length; i++) {
    for (let j = 0; j < codes.length; j++) {
      if (i !== j) {
        assert.ok(!codes[j]!.startsWith(codes[i]!), '不应是另一码的前缀');
      }
    }
  }
});

test('huffman 编码长度 = 各字符码长按频次加权之和', () => {
  const input = 'ABRACADABRA';
  const r = huffman(input);
  const freq = new Map<string, number>();
  for (const ch of input) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  let expected = 0;
  for (const [ch, f] of freq) expected += f * r.codes.get(ch)!.length;
  assert.equal(r.encodedBits, expected);
});

test('huffman 编码后不膨胀（相对 8 位/字符）', () => {
  const r = huffman('ABRACADABRA');
  assert.ok(r.encodedBits <= r.originalBits);
});

test('huffman 空输入', () => {
  const r = huffman('');
  assert.equal(r.root, null);
  assert.equal(r.encoded, '');
  assert.equal(r.encodedBits, 0);
});

test('huffman 确定性（两次构建码表一致）', () => {
  const a = huffman('ABRACADABRA').codes;
  const b = huffman('ABRACADABRA').codes;
  assert.deepEqual([...a.entries()], [...b.entries()]);
});

test('huffman 钩子被调用', () => {
  const merged: number[] = [];
  const assigned: string[] = [];
  huffman('AABB', {
    onMerge: (_a, _b, m) => merged.push(m.freq),
    onAssignCode: (ch, code) => assigned.push(`${ch}=${code}`),
  });
  assert.ok(merged.length >= 1, '至少一次合并');
  assert.ok(assigned.length === 2, '两个字符各赋码');
});

test('buildTrace 含频次帧、树帧、码表帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  // 至少一帧含 map（频次或码表）
  assert.ok(
    frames.some((f) => f.map),
    '存在 map 帧',
  );
  // 至少一帧含 tree
  assert.ok(
    frames.some((f) => f.tree),
    '存在 tree 帧',
  );
  // 末帧为码表
  const last = frames[frames.length - 1]!;
  assert.ok(last.map);
  const codeMap = new Map(last.map!.map((e) => [e.key, e.value]));
  // ABRACADABRA 各字符都应有码
  for (const ch of 'ABCD') {
    assert.ok(codeMap.has(ch), `字符 ${ch} 应有编码`);
    assert.ok(/^[01]+$/.test(codeMap.get(ch)!), '编码应为 0/1 串');
  }
});
