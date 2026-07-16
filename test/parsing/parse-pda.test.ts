import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAnBnPda } from '../../src/algorithms/parsing/parse-pda/impl.ts';

test('pda a^n b^n 接受', () => {
  assert.equal(buildAnBnPda().run(['a', 'a', 'b', 'b']), true);
  assert.equal(buildAnBnPda().run([]), true);
  assert.equal(buildAnBnPda().run(['a', 'b']), true);
});
test('pda a^n b^n 拒绝', () => {
  assert.equal(buildAnBnPda().run(['a', 'a', 'b']), false);
  assert.equal(buildAnBnPda().run(['b', 'a']), false);
  assert.equal(buildAnBnPda().run(['a', 'b', 'b']), false);
});
