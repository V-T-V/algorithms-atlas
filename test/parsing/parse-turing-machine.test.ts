import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildIncTm } from '../../src/algorithms/parsing/parse-turing-machine/impl.ts';

test('tm 二进制 +1', () => {
  const r = buildIncTm().run(['1', '0', '1', '1']);
  // little-endian 1011 +1 = 1100 -> tape cells 0..3 = 0,1,1,1 (little-endian of 1110)?
  // 小端 1011 = 1+2+0+8 = 11, +1 = 12 = 小端 0011
  const out = [r.tape.get(0), r.tape.get(1), r.tape.get(2), r.tape.get(3)];
  assert.deepEqual(out, ['0', '0', '1', '1']);
});
