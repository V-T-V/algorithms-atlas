import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ransEncode, ransDecode } from '../../src/algorithms/compression/comp-rans/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-rans/trace.ts';

test('rans round-trip', () => {
  const data = [65, 65, 66, 65];
  const M = 8;
  const table = new Map([
    [65, { sym: 65, freq: 6, cumStart: 0 }],
    [66, { sym: 66, freq: 2, cumStart: 6 }],
  ]);
  // 构建 slot → sym 查找表
  const slotToSym: number[] = [];
  for (const [, s] of table) for (let k = 0; k < s.freq; k++) slotToSym.push(s.sym);
  const x = ransEncode(data, table, M);
  const decoded = ransDecode(x, table, M, data.length, (slot) => slotToSym[slot]!);
  assert.deepEqual(decoded, data);
});
test('rans trace 非空', () => assert.ok(buildTrace().length > 0));
