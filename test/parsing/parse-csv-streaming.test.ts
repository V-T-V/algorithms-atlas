import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StreamingCsv } from '../../src/algorithms/parsing/parse-csv-streaming/impl.ts';

test('streaming-csv 基本', () => {
  const rows: string[][] = [];
  const p = new StreamingCsv(',', { onRow: (r) => rows.push(r) });
  p.feed('a,b\nc,d');
  p.end();
  assert.deepEqual(rows, [
    ['a', 'b'],
    ['c', 'd'],
  ]);
});
test('streaming-csv 引号包裹', () => {
  const rows: string[][] = [];
  const p = new StreamingCsv(',', { onRow: (r) => rows.push(r) });
  p.feed('"x,y",z');
  p.end();
  assert.deepEqual(rows, [['x,y', 'z']]);
});
test('streaming-csv 跨块', () => {
  const rows: string[][] = [];
  const p = new StreamingCsv(',', { onRow: (r) => rows.push(r) });
  p.feed('a,b');
  p.feed('\nc,d');
  p.end();
  assert.deepEqual(rows, [
    ['a', 'b'],
    ['c', 'd'],
  ]);
});
