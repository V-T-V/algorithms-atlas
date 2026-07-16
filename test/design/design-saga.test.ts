import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runSaga } from '../../src/algorithms/design/design-saga/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-saga/trace.ts';

test('saga 全部成功', async () => {
  const r = await runSaga(
    [
      { name: 'a', action: async () => {}, compensate: async () => {} },
      { name: 'b', action: async () => {}, compensate: async () => {} },
    ],
    {},
  );
  assert.equal(r.ok, true);
  assert.deepEqual(r.completed, ['a', 'b']);
});
test('saga 失败触发反向补偿', async () => {
  const comp: string[] = [];
  const r = await runSaga(
    [
      {
        name: 'a',
        action: async () => {},
        compensate: async () => {
          comp.push('a');
        },
      },
      {
        name: 'b',
        action: async () => {},
        compensate: async () => {
          comp.push('b');
        },
      },
      {
        name: 'c',
        action: async () => {
          throw new Error('x');
        },
        compensate: async () => {},
      },
    ],
    {},
  );
  assert.equal(r.ok, false);
  assert.deepEqual(comp, ['b', 'a']);
  assert.deepEqual(r.compensated, ['b', 'a']);
});
test('saga trace 非空', () => assert.ok(buildTrace().length > 0));
