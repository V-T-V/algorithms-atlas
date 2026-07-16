import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSeqDetector } from '../../src/algorithms/parsing/parse-mealy-machine/impl.ts';

test('mealy "11" 检测', () => {
  assert.deepEqual(buildSeqDetector().run(['1', '1', '0', '1', '1', '1']), [
    '0',
    '1',
    '0',
    '0',
    '1',
    '1',
  ]);
});
