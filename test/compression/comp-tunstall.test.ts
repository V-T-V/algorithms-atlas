import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTunstall,
  tunstallEncode,
  tunstallDecode,
} from '../../src/algorithms/compression/comp-tunstall/impl.ts';
import { buildTrace, DEFAULT_TEXT } from '../../src/algorithms/compression/comp-tunstall/trace.ts';

function roundtrip(text: string): void {
  const alpha = [
    { sym: 'a', prob: 0.5 },
    { sym: 'b', prob: 0.3 },
    { sym: 'c', prob: 0.2 },
  ];
  const r = buildTunstall(alpha, 3);
  const codes = tunstallEncode(text, r);
  assert.equal(tunstallDecode(codes, r), text);
}

test('tunstall 字典大小 = 2^L', () => {
  const r = buildTunstall(
    [
      { sym: 'a', prob: 0.6 },
      { sym: 'b', prob: 0.4 },
    ],
    2,
  );
  assert.equal(r.dict.size, 4);
});

test('tunstall 往返一致', () => {
  roundtrip('aabacb');
});

test('tunstall 高频符号得长串', () => {
  const r = buildTunstall(
    [
      { sym: 'a', prob: 0.9 },
      { sym: 'b', prob: 0.1 },
    ],
    3,
  );
  // 应存在以 'a' 开头的较长串
  assert.ok([...r.dict.keys()].some((s) => s.length >= 2 && s[0] === 'a'));
});

test('tunstall DEFAULT_TEXT 往返', () => {
  roundtrip(DEFAULT_TEXT);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
