import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeKey,
  runningKey,
  runningKeyDecipher,
} from '../../src/algorithms/crypto/running-key/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/running-key/trace.ts';

test('running-key normalizeKey', () => {
  assert.equal(normalizeKey('The Quick!'), 'THEQUICK');
});

test('running-key 编解码往返', () => {
  for (const [s, k] of [
    ['ATTACKATDAWN', 'THE QUICK BROWN FOX'],
    ['HELLOWORLD', 'SECRETKEYWORDXYZ'],
    ['ABC', 'XYZ'],
  ] as const) {
    const c = runningKey(s, k).text;
    assert.equal(runningKeyDecipher(c, k).text, s, `往返不一致: "${s}"`);
  }
});

test('running-key 密钥长度不足报错', () => {
  assert.throws(() => runningKey('ABCDEF', 'AB'));
});

test('running-key 非字母保留不消耗密钥', () => {
  // 'A B' 只消耗 2 个密钥字母
  const { text } = runningKey('A B', 'XY');
  assert.equal(text.length, 3);
});

test('running-key 与手算结果一致（不循环）', () => {
  // running-key 不循环：密钥逐字母消耗；与手算 C=(P+K) mod 26 核对
  // H(7)+X(23)=30 mod26=4=E, E(4)+Y(24)=28 mod26=2=C, L(11)+Z(25)=36 mod26=10=K,
  // L(11)+X(23)=34 mod26=8=I, O(14)+Y(24)=38 mod26=12=M → "ECKIM"
  assert.equal(runningKey('HELLO', 'XYZXY').text, 'ECKIM');
  // 同样的 5 字母明文给足 5 字母密钥 'XYZ' 会因不够长而抛错（不循环回绕）
  assert.throws(() => runningKey('HELLO', 'XYZ'));
});

test('running-key 钩子被调用', () => {
  const maps: Array<[string, string]> = [];
  runningKey('AB', 'XY', false, { onMap: (_i, p, _k, c) => maps.push([p, c]) });
  assert.equal(maps.length, 2);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array, '首帧含 array');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
});
