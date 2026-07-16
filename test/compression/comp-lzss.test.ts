import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lzssCompress, lzssDecompress } from '../../src/algorithms/compression/comp-lzss/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/compression/comp-lzss/trace.ts';

function roundtrip(data: number[]): void {
  const toks = lzssCompress(data, { windowSize: 12, minMatch: 3, maxMatch: 6 });
  const restored = lzssDecompress(toks);
  assert.deepEqual(restored, data);
}

test('lzss 往返一致：重复模式', () => {
  roundtrip([97, 98, 97, 98, 97, 98, 97, 98]);
});

test('lzss 往返一致：长重复', () => {
  roundtrip(Array.from({ length: 20 }, (_, i) => i % 4));
});

test('lzss 无匹配全字面量', () => {
  const toks = lzssCompress([1, 2, 3, 4, 5], { windowSize: 12, minMatch: 3, maxMatch: 6 });
  assert.equal(
    toks.every((t) => !t.isMatch),
    true,
  );
  assert.equal(toks.length, 5);
});

test('lzss 产生回引', () => {
  const toks = lzssCompress([97, 97, 97, 97, 97, 97], { windowSize: 12, minMatch: 3, maxMatch: 6 });
  assert.ok(toks.some((t) => t.isMatch));
});

test('lzss 空输入', () => {
  assert.deepEqual(lzssCompress([]), []);
  assert.deepEqual(lzssDecompress([]), []);
});

test('lzss 钩子被调用', () => {
  const positions: number[] = [];
  lzssCompress(
    [1, 1, 1, 1],
    { windowSize: 8, minMatch: 3, maxMatch: 4 },
    {
      onToken: (p) => positions.push(p),
    },
  );
  assert.ok(positions.length >= 1);
});

test('buildTrace 生成帧且末帧含 token 数', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux);
  const cnt = last.aux!.find((e) => e.label === 'Token 数');
  assert.ok(cnt);
});
