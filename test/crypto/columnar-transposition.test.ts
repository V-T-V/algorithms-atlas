import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  columnOrder,
  columnarDecrypt,
  columnarEncrypt,
  normalizeKey,
} from '../../src/algorithms/crypto/columnar-transposition/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/crypto/columnar-transposition/trace.ts';

test('columnar normalizeKey 清洗', () => {
  assert.equal(normalizeKey('Zeb ra!'), 'ZEBRA');
  assert.equal(normalizeKey(''), 'A');
});

test('columnar columnOrder 升序稳定', () => {
  // ZEBRA：索引 0=Z,1=E,2=B,3=R,4=A；字母升序 A<B<E<R<Z → 对应原列索引 4,2,1,3,0
  assert.deepEqual(columnOrder('ZEBRA'), [4, 2, 1, 3, 0]);
});

test('columnar 编解码往返一致（含补 X）', () => {
  for (const [s, k] of [
    ['THEQUICKBROWNFOX', 'ZEBRA'],
    ['ATTACKATDAWN', 'LEMON'],
    ['ABC', 'KEY'],
    ['A', 'Z'],
    ['', 'ZEBRA'],
  ] as const) {
    const { text } = columnarEncrypt(s, k);
    const back = columnarDecrypt(text, k);
    // 由于补 X，去尾
    const expected = s.padEnd(back.length, 'X');
    assert.equal(back, expected, `往返不一致: "${s}" key="${k}"`);
  }
});

test('columnar 单列密钥退化为原文（带补 X）', () => {
  // key="A" → 1 列，密文 = 原文 + 补 X
  const { text } = columnarEncrypt('ABC', 'A');
  assert.equal(text, 'ABC');
});

test('columnar 钩子被调用', () => {
  const fills: Array<[number, number]> = [];
  columnarEncrypt('ABCDEF', 'BA', {
    onFill: (r, c) => fills.push([r, c]),
  });
  // 6 字符 / 2 列 = 3 行，6 次填充
  assert.equal(fills.length, 6);
});

test('columnar 读列顺序与 columnOrder 一致', () => {
  const order = columnOrder('ZEBRA');
  const readCols: number[] = [];
  columnarEncrypt('THEQUICKBROWN', 'ZEBRA', {
    onReadColumn: (c) => readCols.push(c),
  });
  assert.deepEqual(readCols, order);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.map, '首帧含 map');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
});
