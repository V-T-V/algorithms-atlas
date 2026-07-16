import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, parseCsvSimple } from '../../src/algorithms/parsing/csv-parser/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/parsing/csv-parser/trace.ts';

test('csv-parser 简单两行', () => {
  const rows = parseCsvSimple('a,b,c\n1,2,3');
  assert.deepEqual(rows, [
    ['a', 'b', 'c'],
    ['1', '2', '3'],
  ]);
});

test('csv-parser 引号字段含逗号', () => {
  const rows = parseCsvSimple('"hello, world",b');
  assert.deepEqual(rows[0], ['hello, world', 'b']);
});

test('csv-parser 转义双引号 ""', () => {
  const rows = parseCsvSimple('"say ""hi""",b');
  assert.deepEqual(rows[0], ['say "hi"', 'b']);
});

test('csv-parser 字段内换行', () => {
  const rows = parseCsvSimple('"line1\nline2",b');
  assert.deepEqual(rows, [['line1\nline2', 'b']]);
});

test('csv-parser 字段内 \\r\\n', () => {
  const rows = parseCsvSimple('"a\r\nb",c');
  assert.deepEqual(rows, [['a\r\nb', 'c']]);
});

test('csv-parser 单独 \\r 作为行分隔', () => {
  const rows = parseCsvSimple('a,b\rc,d');
  assert.deepEqual(rows, [
    ['a', 'b'],
    ['c', 'd'],
  ]);
});

test('csv-parser 空字段', () => {
  const rows = parseCsvSimple('a,,c');
  assert.deepEqual(rows[0], ['a', '', 'c']);
});

test('csv-parser 末尾换行不产生空行', () => {
  const rows = parseCsvSimple('a,b\n');
  assert.deepEqual(rows, [['a', 'b']]);
});

test('csv-parser 空字符串', () => {
  const rows = parseCsvSimple('');
  assert.deepEqual(rows, []);
});

test('csv-parser 单行无换行', () => {
  const rows = parseCsvSimple('a,b,c');
  assert.deepEqual(rows, [['a', 'b', 'c']]);
});

test('csv-parser 自定义分隔符 ;', () => {
  const rows = parseCsvSimple('a;b;c', { delimiter: ';' });
  assert.deepEqual(rows[0], ['a', 'b', 'c']);
});

test('csv-parser 引号字段在中间', () => {
  const rows = parseCsvSimple('a,"b,c",d');
  assert.deepEqual(rows[0], ['a', 'b,c', 'd']);
});

test('csv-parser 多行混合', () => {
  const rows = parseCsvSimple('name,age\nAlice,30\n"Bob, Jr.",25');
  assert.deepEqual(rows, [
    ['name', 'age'],
    ['Alice', '30'],
    ['Bob, Jr.', '25'],
  ]);
});

test('csv-parser 钩子 onRecordEnd 触发', () => {
  let records = 0;
  parseCsv('a,b\nc,d', {}, { onRecordEnd: () => records++ });
  assert.equal(records, 2);
});

test('csv-parser 钩子 onFieldEnd 触发', () => {
  let fields = 0;
  parseCsv('a,b,c', {}, { onFieldEnd: () => fields++ });
  assert.equal(fields, 3);
});

test('csv-parser 钩子 onTransition 触发', () => {
  let transitions = 0;
  parseCsv('"a",b', {}, { onTransition: () => transitions++ });
  assert.ok(transitions > 0);
});

test('buildTrace 含 array2d，末帧含总行数', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array2d, '首帧含 array2d');
  const last = frames[frames.length - 1]!;
  const tot = last.aux!.find((e) => e.label === '总行数');
  assert.ok(tot, '末帧应含总行数');
  assert.ok(Number(tot!.value) > 0);
});
