import { test } from 'node:test';
import assert from 'node:assert/strict';
import { playfair, prepareText } from '../../src/algorithms/crypto/playfair/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/playfair/trace.ts';

test('prepareText 处理双字母与补 X', () => {
  // LL 相同 → 插 X
  assert.deepEqual(prepareText('HELLO'), ['HE', 'LX', 'LO']);
  assert.deepEqual(prepareText('HI'), ['HI']);
  // J -> I
  assert.deepEqual(prepareText('JAZZ'), ['IA', 'ZX', 'ZX']);
});

test('playfair 确定性', () => {
  assert.equal(playfair('HIDE', 'KEY').text, playfair('HIDE', 'KEY').text);
});

test('playfair HIDETHEGOLD 已知映射', () => {
  // 经典示例（X 末尾补全约定下）首 5 对稳定
  const cipher = playfair('HIDETHEGOLD', 'PLAYFAIR EXAMPLE').text;
  assert.equal(cipher.startsWith('BMODZBXDNA'), true);
  assert.equal(cipher.length, 12);
});

test('playfair J 并入 I', () => {
  const r = playfair('JUMBO');
  assert.ok(!r.text.includes('J'));
});

test('playfair 钩子按对触发', () => {
  let n = 0;
  playfair('HIDE', 'KEY', { onPair: () => n++ });
  assert.equal(n, 2);
});

test('buildTrace 含字母对帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.map);
  assert.ok(last.map!.some((e) => e.key.startsWith('密文')));
});
