import { test } from 'node:test';
import assert from 'node:assert/strict';
import { panicRecover } from '../../src/algorithms/parsing/parse-error-recovery/impl.ts';

test('panic recovery 保留有效与同步点', () => {
  const r = panicRecover(['a', '@', 'b', ';', '!', 'c', '}'], new Set(['a', 'b', 'c']));
  assert.deepEqual(r.tokens, ['a', 'b', ';', 'c', '}']);
  assert.equal(r.errors.length, 2);
});
test('panic recovery 无错误透传', () => {
  const r = panicRecover(['a', 'b', ';'], new Set(['a', 'b']));
  assert.deepEqual(r.tokens, ['a', 'b', ';']);
  assert.equal(r.errors.length, 0);
});
