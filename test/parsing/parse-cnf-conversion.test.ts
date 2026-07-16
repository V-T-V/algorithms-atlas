import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toCnf } from '../../src/algorithms/parsing/parse-cnf-conversion/impl.ts';

test('cnf 二元化', () => {
  const cnf = toCnf([{ head: 'S', syms: ['A', 'B', 'C', 'D'] }]);
  assert.ok(cnf.length >= 3);
  for (const r of cnf) assert.ok(r.syms.length <= 2);
});
test('cnf 终结符打包', () => {
  const cnf = toCnf([{ head: 'S', syms: ['a', 'b'] }]);
  // 二元规则中 a, b 应被替换为 T0, T1
  assert.deepEqual(cnf[0]!.syms, ['T0', 'T1']);
});
