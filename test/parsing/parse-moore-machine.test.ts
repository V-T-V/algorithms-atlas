import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMooreSeq } from '../../src/algorithms/parsing/parse-moore-machine/impl.ts';

test('moore "11" 检测', () => {
  const out = buildMooreSeq().run(['1', '1', '0', '1', '1']);
  assert.deepEqual(out, ['0', '0', '1', '0', '0', '1']);
});
