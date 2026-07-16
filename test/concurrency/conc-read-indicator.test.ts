import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readIndicator } from '../../src/algorithms/concurrency/conc-read-indicator/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-read-indicator/trace.ts';
test('ri 写在读者活跃时阻塞', () => {
  const r = readIndicator([
    { op: 're', tid: 1 },
    { op: 'w', tid: 0 },
  ]);
  assert.equal(r.writersBlocked, 1);
});
test('ri trace 非空', () => assert.ok(buildTrace().length >= 2));
