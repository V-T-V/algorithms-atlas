import { test } from 'node:test';
import assert from 'node:assert/strict';
import { railFenceDecrypt, railFenceEncrypt } from '../../src/algorithms/crypto/rail-fence/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/rail-fence/trace.ts';

test('rail-fence 已知加密（3 rails）', () => {
  // WEAREDISCOVERED → 经典示例
  // rails: W E C R /  A E D S O E /  R I V
  // → WECRLTEERDSOEE... 用经典 11 字母示例更稳：
  assert.equal(railFenceEncrypt('HELLOWORLD', 3).text, 'HOLELWRDLO');
});

test('rail-fence 编解码往返一致', () => {
  for (const [s, r] of [
    ['WEAREDISCOVERED', 3],
    ['HELLOWORLD', 3],
    ['ABCDE', 2],
    ['A', 1],
    ['', 3],
  ] as const) {
    const { text } = railFenceEncrypt(s, r);
    assert.equal(railFenceDecrypt(text, r), s, `往返不一致: "${s}" rails=${r}`);
  }
});

test('rail-fence rails=1 等于原文', () => {
  assert.equal(railFenceEncrypt('ABCDE', 1).text, 'ABCDE');
});

test('rail-fence rails>=len 退化为分组', () => {
  // rails >= len 时每字符一条栏，密文=原文
  assert.equal(railFenceEncrypt('ABC', 10).text, 'ABC');
});

test('rail-fence rails 非法报错', () => {
  assert.throws(() => railFenceEncrypt('ABC', 0));
  assert.throws(() => railFenceEncrypt('ABC', -1));
  assert.throws(() => railFenceEncrypt('ABC', 1.5));
});

test('rail-fence 钩子被调用', () => {
  const places: Array<[string, number]> = [];
  railFenceEncrypt('ABC', 2, { onPlace: (_i, ch, rail) => places.push([ch, rail]) });
  assert.equal(places.length, 3);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array2d, '首帧含 array2d');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
});
